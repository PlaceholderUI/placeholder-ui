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
//     const document = formData.get('document') as File

//     if (!document) {
//       return json({ error: 'No document provided' }, { status: 400 })
//     }

//     // Validate file size (max 5MB for testing)
//     const maxSize = 5 * 1024 * 1024 // 5MB
//     if (document.size > maxSize) {
//       return json({ error: 'Document too large (max 5MB)' }, { status: 400 })
//     }

//     // Convert to base64 data URL
//     const arrayBuffer = await document.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     const base64 = buffer.toString('base64')
//     const dataUrl = `data:${document.type};base64,${base64}`

//     // Return the link label and URL that will be inserted as a hyperlink
//     return json({
//       label: document.name,
//       url: dataUrl,
//       size: document.size,
//       type: document.type
//     })
//   } catch (error) {
//     console.error('Document upload error:', error)
//     return json({ error: 'Failed to process document' }, { status: 500 })
//   }
// }
