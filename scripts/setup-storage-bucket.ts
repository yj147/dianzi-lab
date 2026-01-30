import { createClient } from '@supabase/supabase-js'

const BUCKET_NAME = 'deliverables'

async function setupStorageBucket() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error('Failed to list buckets:', listError.message)
    process.exit(1)
  }

  const bucketExists = existingBuckets?.some((b) => b.name === BUCKET_NAME)
  if (bucketExists) {
    console.log(`Bucket '${BUCKET_NAME}' already exists.`)
    return
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024,
  })

  if (createError) {
    console.error('Failed to create bucket:', createError.message)
    process.exit(1)
  }

  console.log(`Bucket '${BUCKET_NAME}' created successfully.`)
}

setupStorageBucket().catch(console.error)
