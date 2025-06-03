/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/upload/route";
exports.ids = ["app/api/upload/route"];
exports.modules = {

/***/ "(rsc)/./app/api/upload/route.ts":
/*!*********************************!*\
  !*** ./app/api/upload/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/.pnpm/@supabase+supabase-js@2.49.8/node_modules/@supabase/supabase-js/dist/module/index.js\");\n\n\n// Initialize Supabase client\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://vnejfcnhsczzohegxnrf.supabase.co\", process.env.SUPABASE_SERVICE_ROLE_KEY);\nasync function POST(request) {\n    try {\n        // Log environment check\n        if (false) {}\n        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {\n            console.error('Missing SUPABASE_SERVICE_ROLE_KEY');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Supabase service role key not configured'\n            }, {\n                status: 500\n            });\n        }\n        const formData = await request.formData();\n        const file = formData.get('file');\n        if (!file) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'No file provided'\n            }, {\n                status: 400\n            });\n        }\n        console.log('File received:', {\n            name: file.name,\n            type: file.type,\n            size: file.size\n        });\n        // Validate file type\n        const allowedTypes = [\n            'image/jpeg',\n            'image/png',\n            'image/webp',\n            'image/gif',\n            'video/mp4',\n            'video/webm',\n            'video/quicktime',\n            'video/x-msvideo',\n            'video/x-matroska',\n            'video/avi',\n            'application/octet-stream' // fallback for some video files\n        ];\n        if (!allowedTypes.includes(file.type)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: `File type ${file.type} not supported. Allowed: ${allowedTypes.join(', ')}`\n            }, {\n                status: 400\n            });\n        }\n        // Validate file size (50MB max)\n        const maxSize = 50 * 1024 * 1024 // 50MB\n        ;\n        if (file.size > maxSize) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'File size too large. Maximum size is 50MB'\n            }, {\n                status: 400\n            });\n        }\n        // Generate unique filename\n        const timestamp = Date.now();\n        const extension = file.name.split('.').pop();\n        const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;\n        // Determine storage bucket based on file type\n        const bucket = file.type.startsWith('video/') ? 'videos' : 'images';\n        console.log('Using bucket:', bucket, 'for file:', fileName);\n        // Convert File to ArrayBuffer\n        const fileBuffer = await file.arrayBuffer();\n        console.log('File buffer ready, size:', fileBuffer.byteLength);\n        // Upload to Supabase Storage directly (no bucket checking to avoid race conditions)\n        console.log('Starting upload to Supabase...');\n        const { data, error } = await supabase.storage.from(bucket).upload(fileName, fileBuffer, {\n            contentType: file.type,\n            cacheControl: '3600',\n            upsert: false\n        });\n        if (error) {\n            console.error('Supabase upload error:', error);\n            // Special handling for bucket not found errors\n            if (error.message.includes('bucket') || error.message.includes('not found')) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: `Storage bucket '${bucket}' not found. Please run the storage setup SQL script.`,\n                    details: error.message,\n                    bucket: bucket,\n                    setupRequired: true\n                }, {\n                    status: 500\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Failed to upload file',\n                details: error.message,\n                bucket: bucket,\n                fileName: fileName\n            }, {\n                status: 500\n            });\n        }\n        console.log('Upload successful:', data);\n        // Get public URL\n        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);\n        console.log('Generated public URL:', urlData.publicUrl);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            url: urlData.publicUrl,\n            path: data.path,\n            bucket: bucket\n        });\n    } catch (error) {\n        console.error('Upload error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Internal server error',\n            details: error instanceof Error ? error.message : 'Unknown error'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3VwbG9hZC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBdUQ7QUFDSDtBQUVwRCw2QkFBNkI7QUFDN0IsTUFBTUUsV0FBV0QsbUVBQVlBLENBQzNCRSwwQ0FBb0MsRUFDcENBLFFBQVFDLEdBQUcsQ0FBQ0UseUJBQXlCO0FBR2hDLGVBQWVDLEtBQUtDLE9BQW9CO0lBQzdDLElBQUk7UUFDRix3QkFBd0I7UUFDeEIsSUFBSSxLQUFxQyxFQUFFLEVBTTFDO1FBRUQsSUFBSSxDQUFDTCxRQUFRQyxHQUFHLENBQUNFLHlCQUF5QixFQUFFO1lBQzFDRyxRQUFRQyxLQUFLLENBQUM7WUFDZCxPQUFPVixxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtnQkFBRUQsT0FBTztZQUEyQyxHQUNwRDtnQkFBRUUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTUMsV0FBVyxNQUFNTCxRQUFRSyxRQUFRO1FBQ3ZDLE1BQU1DLE9BQU9ELFNBQVNFLEdBQUcsQ0FBQztRQUUxQixJQUFJLENBQUNELE1BQU07WUFDVCxPQUFPZCxxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtnQkFBRUQsT0FBTztZQUFtQixHQUM1QjtnQkFBRUUsUUFBUTtZQUFJO1FBRWxCO1FBRUFILFFBQVFPLEdBQUcsQ0FBQyxrQkFBa0I7WUFDNUJDLE1BQU1ILEtBQUtHLElBQUk7WUFDZkMsTUFBTUosS0FBS0ksSUFBSTtZQUNmQyxNQUFNTCxLQUFLSyxJQUFJO1FBQ2pCO1FBRUEscUJBQXFCO1FBQ3JCLE1BQU1DLGVBQWU7WUFDbkI7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQSwyQkFBMkIsZ0NBQWdDO1NBQzVEO1FBRUQsSUFBSSxDQUFDQSxhQUFhQyxRQUFRLENBQUNQLEtBQUtJLElBQUksR0FBRztZQUNyQyxPQUFPbEIscURBQVlBLENBQUNXLElBQUksQ0FDdEI7Z0JBQUVELE9BQU8sQ0FBQyxVQUFVLEVBQUVJLEtBQUtJLElBQUksQ0FBQyx5QkFBeUIsRUFBRUUsYUFBYUUsSUFBSSxDQUFDLE9BQU87WUFBQyxHQUNyRjtnQkFBRVYsUUFBUTtZQUFJO1FBRWxCO1FBRUEsZ0NBQWdDO1FBQ2hDLE1BQU1XLFVBQVUsS0FBSyxPQUFPLEtBQUssT0FBTzs7UUFDeEMsSUFBSVQsS0FBS0ssSUFBSSxHQUFHSSxTQUFTO1lBQ3ZCLE9BQU92QixxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtnQkFBRUQsT0FBTztZQUE0QyxHQUNyRDtnQkFBRUUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsMkJBQTJCO1FBQzNCLE1BQU1ZLFlBQVlDLEtBQUtDLEdBQUc7UUFDMUIsTUFBTUMsWUFBWWIsS0FBS0csSUFBSSxDQUFDVyxLQUFLLENBQUMsS0FBS0MsR0FBRztRQUMxQyxNQUFNQyxXQUFXLEdBQUdOLFVBQVUsQ0FBQyxFQUFFTyxLQUFLQyxNQUFNLEdBQUdDLFFBQVEsQ0FBQyxJQUFJQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUVQLFdBQVc7UUFFdkYsOENBQThDO1FBQzlDLE1BQU1RLFNBQVNyQixLQUFLSSxJQUFJLENBQUNrQixVQUFVLENBQUMsWUFBWSxXQUFXO1FBQzNEM0IsUUFBUU8sR0FBRyxDQUFDLGlCQUFpQm1CLFFBQVEsYUFBYUw7UUFFbEQsOEJBQThCO1FBQzlCLE1BQU1PLGFBQWEsTUFBTXZCLEtBQUt3QixXQUFXO1FBQ3pDN0IsUUFBUU8sR0FBRyxDQUFDLDRCQUE0QnFCLFdBQVdFLFVBQVU7UUFFN0Qsb0ZBQW9GO1FBQ3BGOUIsUUFBUU8sR0FBRyxDQUFDO1FBQ1osTUFBTSxFQUFFd0IsSUFBSSxFQUFFOUIsS0FBSyxFQUFFLEdBQUcsTUFBTVIsU0FBU3VDLE9BQU8sQ0FDM0NDLElBQUksQ0FBQ1AsUUFDTFEsTUFBTSxDQUFDYixVQUFVTyxZQUFZO1lBQzVCTyxhQUFhOUIsS0FBS0ksSUFBSTtZQUN0QjJCLGNBQWM7WUFDZEMsUUFBUTtRQUNWO1FBRUYsSUFBSXBDLE9BQU87WUFDVEQsUUFBUUMsS0FBSyxDQUFDLDBCQUEwQkE7WUFFeEMsK0NBQStDO1lBQy9DLElBQUlBLE1BQU1xQyxPQUFPLENBQUMxQixRQUFRLENBQUMsYUFBYVgsTUFBTXFDLE9BQU8sQ0FBQzFCLFFBQVEsQ0FBQyxjQUFjO2dCQUMzRSxPQUFPckIscURBQVlBLENBQUNXLElBQUksQ0FDdEI7b0JBQ0VELE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRXlCLE9BQU8scURBQXFELENBQUM7b0JBQ3ZGYSxTQUFTdEMsTUFBTXFDLE9BQU87b0JBQ3RCWixRQUFRQTtvQkFDUmMsZUFBZTtnQkFDakIsR0FDQTtvQkFBRXJDLFFBQVE7Z0JBQUk7WUFFbEI7WUFFQSxPQUFPWixxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtnQkFDRUQsT0FBTztnQkFDUHNDLFNBQVN0QyxNQUFNcUMsT0FBTztnQkFDdEJaLFFBQVFBO2dCQUNSTCxVQUFVQTtZQUNaLEdBQ0E7Z0JBQUVsQixRQUFRO1lBQUk7UUFFbEI7UUFFQUgsUUFBUU8sR0FBRyxDQUFDLHNCQUFzQndCO1FBRWxDLGlCQUFpQjtRQUNqQixNQUFNLEVBQUVBLE1BQU1VLE9BQU8sRUFBRSxHQUFHaEQsU0FBU3VDLE9BQU8sQ0FDdkNDLElBQUksQ0FBQ1AsUUFDTGdCLFlBQVksQ0FBQ1gsS0FBS1ksSUFBSTtRQUV6QjNDLFFBQVFPLEdBQUcsQ0FBQyx5QkFBeUJrQyxRQUFRRyxTQUFTO1FBRXRELE9BQU9yRCxxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO1lBQ3ZCMkMsU0FBUztZQUNUQyxLQUFLTCxRQUFRRyxTQUFTO1lBQ3RCRCxNQUFNWixLQUFLWSxJQUFJO1lBQ2ZqQixRQUFRQTtRQUNWO0lBRUYsRUFBRSxPQUFPekIsT0FBTztRQUNkRCxRQUFRQyxLQUFLLENBQUMsaUJBQWlCQTtRQUMvQixPQUFPVixxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtZQUNFRCxPQUFPO1lBQ1BzQyxTQUFTdEMsaUJBQWlCOEMsUUFBUTlDLE1BQU1xQyxPQUFPLEdBQUc7UUFDcEQsR0FDQTtZQUFFbkMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXJtYW5cXERvd25sb2Fkc1xccm9ibG94LWFuaW1lLWNvdW50ZG93blxcYXBwXFxhcGlcXHVwbG9hZFxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXHJcblxyXG4vLyBJbml0aWFsaXplIFN1cGFiYXNlIGNsaWVudFxyXG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcclxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwhLFxyXG4gIHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXHJcbilcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIExvZyBlbnZpcm9ubWVudCBjaGVja1xyXG4gICAgaWYgKCFwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyBORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwnKVxyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ1N1cGFiYXNlIFVSTCBub3QgY29uZmlndXJlZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIFNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVknKVxyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ1N1cGFiYXNlIHNlcnZpY2Ugcm9sZSBrZXkgbm90IGNvbmZpZ3VyZWQnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IGF3YWl0IHJlcXVlc3QuZm9ybURhdGEoKVxyXG4gICAgY29uc3QgZmlsZSA9IGZvcm1EYXRhLmdldCgnZmlsZScpIGFzIEZpbGVcclxuICAgIFxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiAnTm8gZmlsZSBwcm92aWRlZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdGaWxlIHJlY2VpdmVkOicsIHtcclxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICB0eXBlOiBmaWxlLnR5cGUsXHJcbiAgICAgIHNpemU6IGZpbGUuc2l6ZVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBWYWxpZGF0ZSBmaWxlIHR5cGVcclxuICAgIGNvbnN0IGFsbG93ZWRUeXBlcyA9IFtcclxuICAgICAgJ2ltYWdlL2pwZWcnLFxyXG4gICAgICAnaW1hZ2UvcG5nJyxcclxuICAgICAgJ2ltYWdlL3dlYnAnLFxyXG4gICAgICAnaW1hZ2UvZ2lmJyxcclxuICAgICAgJ3ZpZGVvL21wNCcsXHJcbiAgICAgICd2aWRlby93ZWJtJyxcclxuICAgICAgJ3ZpZGVvL3F1aWNrdGltZScsXHJcbiAgICAgICd2aWRlby94LW1zdmlkZW8nLCAvLyAuYXZpXHJcbiAgICAgICd2aWRlby94LW1hdHJvc2thJywgLy8gLm1rdlxyXG4gICAgICAndmlkZW8vYXZpJyxcclxuICAgICAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgLy8gZmFsbGJhY2sgZm9yIHNvbWUgdmlkZW8gZmlsZXNcclxuICAgIF1cclxuXHJcbiAgICBpZiAoIWFsbG93ZWRUeXBlcy5pbmNsdWRlcyhmaWxlLnR5cGUpKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiBgRmlsZSB0eXBlICR7ZmlsZS50eXBlfSBub3Qgc3VwcG9ydGVkLiBBbGxvd2VkOiAke2FsbG93ZWRUeXBlcy5qb2luKCcsICcpfWAgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFZhbGlkYXRlIGZpbGUgc2l6ZSAoNTBNQiBtYXgpXHJcbiAgICBjb25zdCBtYXhTaXplID0gNTAgKiAxMDI0ICogMTAyNCAvLyA1ME1CXHJcbiAgICBpZiAoZmlsZS5zaXplID4gbWF4U2l6ZSkge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ0ZpbGUgc2l6ZSB0b28gbGFyZ2UuIE1heGltdW0gc2l6ZSBpcyA1ME1CJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgdW5pcXVlIGZpbGVuYW1lXHJcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXHJcbiAgICBjb25zdCBleHRlbnNpb24gPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgY29uc3QgZmlsZU5hbWUgPSBgJHt0aW1lc3RhbXB9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpfS4ke2V4dGVuc2lvbn1gXHJcbiAgICBcclxuICAgIC8vIERldGVybWluZSBzdG9yYWdlIGJ1Y2tldCBiYXNlZCBvbiBmaWxlIHR5cGVcclxuICAgIGNvbnN0IGJ1Y2tldCA9IGZpbGUudHlwZS5zdGFydHNXaXRoKCd2aWRlby8nKSA/ICd2aWRlb3MnIDogJ2ltYWdlcydcclxuICAgIGNvbnNvbGUubG9nKCdVc2luZyBidWNrZXQ6JywgYnVja2V0LCAnZm9yIGZpbGU6JywgZmlsZU5hbWUpXHJcbiAgICBcclxuICAgIC8vIENvbnZlcnQgRmlsZSB0byBBcnJheUJ1ZmZlclxyXG4gICAgY29uc3QgZmlsZUJ1ZmZlciA9IGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKVxyXG4gICAgY29uc29sZS5sb2coJ0ZpbGUgYnVmZmVyIHJlYWR5LCBzaXplOicsIGZpbGVCdWZmZXIuYnl0ZUxlbmd0aClcclxuICAgIFxyXG4gICAgLy8gVXBsb2FkIHRvIFN1cGFiYXNlIFN0b3JhZ2UgZGlyZWN0bHkgKG5vIGJ1Y2tldCBjaGVja2luZyB0byBhdm9pZCByYWNlIGNvbmRpdGlvbnMpXHJcbiAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgdXBsb2FkIHRvIFN1cGFiYXNlLi4uJylcclxuICAgIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgICAgLmZyb20oYnVja2V0KVxyXG4gICAgICAudXBsb2FkKGZpbGVOYW1lLCBmaWxlQnVmZmVyLCB7XHJcbiAgICAgICAgY29udGVudFR5cGU6IGZpbGUudHlwZSxcclxuICAgICAgICBjYWNoZUNvbnRyb2w6ICczNjAwJyxcclxuICAgICAgICB1cHNlcnQ6IGZhbHNlXHJcbiAgICAgIH0pXHJcblxyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1N1cGFiYXNlIHVwbG9hZCBlcnJvcjonLCBlcnJvcilcclxuICAgICAgXHJcbiAgICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIGJ1Y2tldCBub3QgZm91bmQgZXJyb3JzXHJcbiAgICAgIGlmIChlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdidWNrZXQnKSB8fCBlcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZm91bmQnKSkge1xyXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIGVycm9yOiBgU3RvcmFnZSBidWNrZXQgJyR7YnVja2V0fScgbm90IGZvdW5kLiBQbGVhc2UgcnVuIHRoZSBzdG9yYWdlIHNldHVwIFNRTCBzY3JpcHQuYCxcclxuICAgICAgICAgICAgZGV0YWlsczogZXJyb3IubWVzc2FnZSxcclxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXHJcbiAgICAgICAgICAgIHNldHVwUmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgZXJyb3I6ICdGYWlsZWQgdG8gdXBsb2FkIGZpbGUnLFxyXG4gICAgICAgICAgZGV0YWlsczogZXJyb3IubWVzc2FnZSxcclxuICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxyXG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnVXBsb2FkIHN1Y2Nlc3NmdWw6JywgZGF0YSlcclxuXHJcbiAgICAvLyBHZXQgcHVibGljIFVSTFxyXG4gICAgY29uc3QgeyBkYXRhOiB1cmxEYXRhIH0gPSBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAgIC5mcm9tKGJ1Y2tldClcclxuICAgICAgLmdldFB1YmxpY1VybChkYXRhLnBhdGgpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ0dlbmVyYXRlZCBwdWJsaWMgVVJMOicsIHVybERhdGEucHVibGljVXJsKVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIHVybDogdXJsRGF0YS5wdWJsaWNVcmwsXHJcbiAgICAgIHBhdGg6IGRhdGEucGF0aCxcclxuICAgICAgYnVja2V0OiBidWNrZXRcclxuICAgIH0pXHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdVcGxvYWQgZXJyb3I6JywgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgXHJcbiAgICAgICAgZXJyb3I6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InLFxyXG4gICAgICAgIGRldGFpbHM6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKVxyXG4gIH1cclxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2UiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIlBPU1QiLCJyZXF1ZXN0IiwiY29uc29sZSIsImVycm9yIiwianNvbiIsInN0YXR1cyIsImZvcm1EYXRhIiwiZmlsZSIsImdldCIsImxvZyIsIm5hbWUiLCJ0eXBlIiwic2l6ZSIsImFsbG93ZWRUeXBlcyIsImluY2x1ZGVzIiwiam9pbiIsIm1heFNpemUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZXh0ZW5zaW9uIiwic3BsaXQiLCJwb3AiLCJmaWxlTmFtZSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImJ1Y2tldCIsInN0YXJ0c1dpdGgiLCJmaWxlQnVmZmVyIiwiYXJyYXlCdWZmZXIiLCJieXRlTGVuZ3RoIiwiZGF0YSIsInN0b3JhZ2UiLCJmcm9tIiwidXBsb2FkIiwiY29udGVudFR5cGUiLCJjYWNoZUNvbnRyb2wiLCJ1cHNlcnQiLCJtZXNzYWdlIiwiZGV0YWlscyIsInNldHVwUmVxdWlyZWQiLCJ1cmxEYXRhIiwiZ2V0UHVibGljVXJsIiwicGF0aCIsInB1YmxpY1VybCIsInN1Y2Nlc3MiLCJ1cmwiLCJFcnJvciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/upload/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_arman_Downloads_roblox_anime_countdown_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/upload/route.ts */ \"(rsc)/./app/api/upload/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"export\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/upload/route\",\n        pathname: \"/api/upload\",\n        filename: \"route\",\n        bundlePath: \"app/api/upload/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\arman\\\\Downloads\\\\roblox-anime-countdown\\\\app\\\\api\\\\upload\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_arman_Downloads_roblox_anime_countdown_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ1cGxvYWQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhcm1hbiU1Q0Rvd25sb2FkcyU1Q3JvYmxveC1hbmltZS1jb3VudGRvd24lNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2FybWFuJTVDRG93bmxvYWRzJTVDcm9ibG94LWFuaW1lLWNvdW50ZG93biZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1leHBvcnQmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDK0I7QUFDNUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGFybWFuXFxcXERvd25sb2Fkc1xcXFxyb2Jsb3gtYW5pbWUtY291bnRkb3duXFxcXGFwcFxcXFxhcGlcXFxcdXBsb2FkXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcImV4cG9ydFwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS91cGxvYWQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS91cGxvYWRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3VwbG9hZC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGFybWFuXFxcXERvd25sb2Fkc1xcXFxyb2Jsb3gtYW5pbWUtY291bnRkb3duXFxcXGFwcFxcXFxhcGlcXFxcdXBsb2FkXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0","vendor-chunks/tr46@0.0.3","vendor-chunks/@supabase+auth-js@2.69.1","vendor-chunks/@supabase+realtime-js@2.11.2","vendor-chunks/@supabase+postgrest-js@1.19.4","vendor-chunks/@supabase+node-fetch@2.6.15","vendor-chunks/whatwg-url@5.0.0","vendor-chunks/@supabase+storage-js@2.7.1","vendor-chunks/@supabase+supabase-js@2.49.8","vendor-chunks/@supabase+functions-js@2.4.4","vendor-chunks/webidl-conversions@3.0.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();