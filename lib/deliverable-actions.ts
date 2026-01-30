'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getSupabaseAdmin, DELIVERABLES_BUCKET } from '@/lib/supabase'

export type UploadDeliverableResult =
  | { success: true; deliverable: { id: string; name: string; url: string; size: number } }
  | { success: false; error: string }

export type DeleteDeliverableResult =
  | { success: true }
  | { success: false; error: string }

export type GetDeliverablesResult =
  | { success: true; deliverables: { id: string; name: string; url: string; size: number; createdAt: Date }[] }
  | { success: false; error: string }

export type GetSignedUrlResult =
  | { success: true; signedUrl: string }
  | { success: false; error: string }

export async function uploadDeliverable(
  ideaId: string,
  formData: FormData
): Promise<UploadDeliverableResult> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: '无权限' }
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return { success: false, error: '未提供文件' }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { id: true },
  })
  if (!idea) {
    return { success: false, error: '点子不存在' }
  }

  const supabase = getSupabaseAdmin()
  const fileName = `${ideaId}/${Date.now()}-${file.name}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from(DELIVERABLES_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return { success: false, error: `上传失败: ${uploadError.message}` }
  }

  const { data: urlData } = supabase.storage
    .from(DELIVERABLES_BUCKET)
    .getPublicUrl(fileName)

  const deliverable = await prisma.deliverable.create({
    data: {
      name: file.name,
      url: urlData.publicUrl,
      size: file.size,
      ideaId,
    },
  })

  revalidatePath(`/admin/ideas/${ideaId}`)
  revalidatePath(`/dashboard`)

  return {
    success: true,
    deliverable: {
      id: deliverable.id,
      name: deliverable.name,
      url: deliverable.url,
      size: deliverable.size,
    },
  }
}

export async function deleteDeliverable(
  deliverableId: string
): Promise<DeleteDeliverableResult> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: '无权限' }
  }

  const deliverable = await prisma.deliverable.findUnique({
    where: { id: deliverableId },
    select: { id: true, url: true, ideaId: true },
  })
  if (!deliverable) {
    return { success: false, error: '文件不存在' }
  }

  const supabase = getSupabaseAdmin()
  const urlParts = deliverable.url.split(`/${DELIVERABLES_BUCKET}/`)
  if (urlParts.length > 1) {
    const filePath = urlParts[1]
    const { error: removeError } = await supabase.storage
      .from(DELIVERABLES_BUCKET)
      .remove([filePath])
    if (removeError) {
      return { success: false, error: `存储删除失败: ${removeError.message}` }
    }
  }

  await prisma.deliverable.delete({
    where: { id: deliverableId },
  })

  revalidatePath(`/admin/ideas/${deliverable.ideaId}`)
  revalidatePath(`/dashboard`)

  return { success: true }
}

export async function getDeliverables(
  ideaId: string
): Promise<GetDeliverablesResult> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: '未登录' }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { id: true, userId: true },
  })
  if (!idea) {
    return { success: false, error: '点子不存在' }
  }

  if (session.role !== 'ADMIN' && idea.userId !== session.sub) {
    return { success: false, error: '无权限' }
  }

  const deliverables = await prisma.deliverable.findMany({
    where: { ideaId },
    select: {
      id: true,
      name: true,
      url: true,
      size: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return { success: true, deliverables }
}

export async function getSignedUrl(
  deliverableId: string
): Promise<GetSignedUrlResult> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: '未登录' }
  }

  const deliverable = await prisma.deliverable.findUnique({
    where: { id: deliverableId },
    include: { idea: { select: { userId: true } } },
  })
  if (!deliverable) {
    return { success: false, error: '文件不存在' }
  }

  if (deliverable.idea.userId !== session.sub) {
    return { success: false, error: '无权限' }
  }

  const supabase = getSupabaseAdmin()
  const urlParts = deliverable.url.split(`/${DELIVERABLES_BUCKET}/`)
  if (urlParts.length <= 1) {
    return { success: false, error: '无效的文件路径' }
  }

  const filePath = urlParts[1]
  const { data, error } = await supabase.storage
    .from(DELIVERABLES_BUCKET)
    .createSignedUrl(filePath, 3600)

  if (error || !data) {
    return { success: false, error: `获取签名URL失败: ${error?.message}` }
  }

  return { success: true, signedUrl: data.signedUrl }
}
