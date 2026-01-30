'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getSupabaseAdmin, DELIVERABLES_BUCKET } from '@/lib/supabase'
import {
  MAX_FILE_SIZE,
  isAcceptedExtension,
  describeAcceptedTypes,
} from '@/lib/deliverable-constants'

export type UploadDeliverableResult =
  | { success: true; deliverable: { id: string; name: string; storagePath: string; size: number } }
  | { success: false; error: string }

export type DeleteDeliverableResult =
  | { success: true }
  | { success: false; error: string }

export type GetDeliverablesResult =
  | { success: true; deliverables: { id: string; name: string; storagePath: string; size: number; createdAt: string }[] }
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

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: '文件大小超过 50MB 限制' }
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!isAcceptedExtension(extension)) {
    return {
      success: false,
      error: `不支持的文件类型（仅支持 ${describeAcceptedTypes()}）`,
    }
  }

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { id: true },
  })
  if (!idea) {
    return { success: false, error: '点子不存在' }
  }

  const supabase = getSupabaseAdmin()
  const sanitizedName = file.name
    .replace(/[\/\\]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/[\x00-\x1f\x7f]/g, '')
    .slice(0, 200)
  const fileName = `${ideaId}/${Date.now()}-${sanitizedName}`
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

  let deliverable
  try {
    deliverable = await prisma.deliverable.create({
      data: {
        name: file.name,
        storagePath: fileName,
        size: file.size,
        ideaId,
      },
    })
  } catch {
    await supabase.storage.from(DELIVERABLES_BUCKET).remove([fileName])
    return { success: false, error: '保存文件记录失败' }
  }

  revalidatePath(`/admin/ideas/${ideaId}`)

  return {
    success: true,
    deliverable: {
      id: deliverable.id,
      name: deliverable.name,
      storagePath: deliverable.storagePath,
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
    select: { id: true, storagePath: true, ideaId: true },
  })
  if (!deliverable) {
    return { success: false, error: '文件不存在' }
  }

  const supabase = getSupabaseAdmin()

  try {
    await prisma.deliverable.delete({
      where: { id: deliverableId },
    })
  } catch {
    return { success: false, error: '删除文件记录失败' }
  }

  await supabase.storage.from(DELIVERABLES_BUCKET).remove([deliverable.storagePath])

  revalidatePath(`/admin/ideas/${deliverable.ideaId}`)

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
      storagePath: true,
      size: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    success: true,
    deliverables: deliverables.map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
    })),
  }
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
    select: { storagePath: true, idea: { select: { userId: true } } },
  })
  if (!deliverable) {
    return { success: false, error: '文件不存在' }
  }

  if (deliverable.idea.userId !== session.sub) {
    return { success: false, error: '无权限' }
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(DELIVERABLES_BUCKET)
    .createSignedUrl(deliverable.storagePath, 3600)

  if (error || !data) {
    return { success: false, error: `获取签名URL失败: ${error?.message}` }
  }

  return { success: true, signedUrl: data.signedUrl }
}
