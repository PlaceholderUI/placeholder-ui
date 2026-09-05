// import { json, error } from '@sveltejs/kit'
// import type { RequestHandler } from './$types'
// import { dev } from '$app/environment'

// export const POST: RequestHandler = async ({ request }) => {
//   // Only allow this endpoint in development mode
//   if (!dev) {
//     return error(404, 'Not found')
//   }
//   try {
//     const formData = await request.formData()
//     const image = formData.get('image') as File

//     if (!image) {
//       return json({ error: 'No image provided' }, { status: 400 })
//     }

//     // Validate file type
//     if (!image.type.startsWith('image/')) {
//       return json({ error: 'File must be an image' }, { status: 400 })
//     }

//     // Validate file size (max 5MB for testing)
//     const maxSize = 5 * 1024 * 1024 // 5MB
//     if (image.size > maxSize) {
//       return json({ error: 'Image too large (max 5MB)' }, { status: 400 })
//     }

//     // Convert to base64 data URL
//     const arrayBuffer = await image.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     const base64 = buffer.toString('base64')
//     const dataUrl = `data:${image.type};base64,${base64}`

//     // Return the data URL
//     return json({
//       url: dataUrl,
//       imageUrl: dataUrl,
//       path: dataUrl,
//       filename: image.name,
//       size: image.size,
//       type: image.type
//     })
//   } catch (error) {
//     console.error('Image upload error:', error)
//     return json({ error: 'Failed to process image' }, { status: 500 })
//   }
// }
