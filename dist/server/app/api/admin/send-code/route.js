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
exports.id = "app/api/admin/send-code/route";
exports.ids = ["app/api/admin/send-code/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/send-code/route.ts":
/*!******************************************!*\
  !*** ./app/api/admin/send-code/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/.pnpm/nodemailer@7.0.3/node_modules/nodemailer/lib/nodemailer.js\");\n/* harmony import */ var _lib_verification_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/verification-storage */ \"(rsc)/./lib/verification-storage.ts\");\n\n\n\nasync function POST(request) {\n    try {\n        const { password } = await request.json();\n        // Verify admin password first\n        const adminPassword = process.env.ADMIN_PASSWORD;\n        const adminEmail = process.env.ADMIN_EMAIL;\n        const gmailUser = process.env.GMAIL_USER;\n        const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;\n        if (!adminPassword || !adminEmail || !gmailUser || !gmailAppPassword) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Server configuration incomplete'\n            }, {\n                status: 500\n            });\n        }\n        if (password !== adminPassword) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid password'\n            }, {\n                status: 401\n            });\n        }\n        // Generate 6-digit verification code\n        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();\n        // Store code with 10-minute expiry\n        _lib_verification_storage__WEBPACK_IMPORTED_MODULE_2__.verificationCodes.set(adminEmail, {\n            code: verificationCode,\n            expires: Date.now() + 10 * 60 * 1000 // 10 minutes\n        });\n        console.log(`Generated verification code ${verificationCode} for ${adminEmail}`) // Debug log\n        ;\n        // Create transporter\n        const transporter = nodemailer__WEBPACK_IMPORTED_MODULE_1__.createTransport({\n            service: 'gmail',\n            auth: {\n                user: gmailUser,\n                pass: gmailAppPassword\n            }\n        });\n        // Send email\n        await transporter.sendMail({\n            from: `\"AniBlox Admin\" <${gmailUser}>`,\n            to: adminEmail,\n            subject: 'Admin Panel Verification Code',\n            html: `\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <h2 style=\"color: #333; text-align: center;\">Admin Panel Access</h2>\n          <div style=\"background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center;\">\n            <h3 style=\"color: #666;\">Your verification code is:</h3>\n            <div style=\"font-size: 32px; font-weight: bold; color: #007bff; margin: 20px 0; letter-spacing: 5px;\">\n              ${verificationCode}\n            </div>\n            <p style=\"color: #666; margin-top: 20px;\">\n              This code will expire in 10 minutes.\n            </p>\n            <p style=\"color: #999; font-size: 14px;\">\n              If you didn't request this code, please ignore this email.\n            </p>\n          </div>\n        </div>\n      `\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: 'Verification code sent to your email'\n        });\n    } catch (error) {\n        console.error('Error sending verification code:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to send verification code'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL3NlbmQtY29kZS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXVEO0FBQ3BCO0FBQzJCO0FBRXZELGVBQWVHLEtBQUtDLE9BQW9CO0lBQzdDLElBQUk7UUFDRixNQUFNLEVBQUVDLFFBQVEsRUFBRSxHQUFHLE1BQU1ELFFBQVFFLElBQUk7UUFFdkMsOEJBQThCO1FBQzlCLE1BQU1DLGdCQUFnQkMsUUFBUUMsR0FBRyxDQUFDQyxjQUFjO1FBQ2hELE1BQU1DLGFBQWFILFFBQVFDLEdBQUcsQ0FBQ0csV0FBVztRQUMxQyxNQUFNQyxZQUFZTCxRQUFRQyxHQUFHLENBQUNLLFVBQVU7UUFDeEMsTUFBTUMsbUJBQW1CUCxRQUFRQyxHQUFHLENBQUNPLGtCQUFrQjtRQUV2RCxJQUFJLENBQUNULGlCQUFpQixDQUFDSSxjQUFjLENBQUNFLGFBQWEsQ0FBQ0Usa0JBQWtCO1lBQ3BFLE9BQU9mLHFEQUFZQSxDQUFDTSxJQUFJLENBQ3RCO2dCQUFFVyxPQUFPO1lBQWtDLEdBQzNDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxJQUFJYixhQUFhRSxlQUFlO1lBQzlCLE9BQU9QLHFEQUFZQSxDQUFDTSxJQUFJLENBQ3RCO2dCQUFFVyxPQUFPO1lBQW1CLEdBQzVCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxxQ0FBcUM7UUFDckMsTUFBTUMsbUJBQW1CQyxLQUFLQyxLQUFLLENBQUMsU0FBU0QsS0FBS0UsTUFBTSxLQUFLLFFBQVFDLFFBQVE7UUFFN0UsbUNBQW1DO1FBQ25DckIsd0VBQWlCQSxDQUFDc0IsR0FBRyxDQUFDYixZQUFZO1lBQ2hDYyxNQUFNTjtZQUNOTyxTQUFTQyxLQUFLQyxHQUFHLEtBQUssS0FBSyxLQUFLLEtBQUssYUFBYTtRQUNwRDtRQUVBQyxRQUFRQyxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsRUFBRVgsaUJBQWlCLEtBQUssRUFBRVIsWUFBWSxFQUFFLFlBQVk7O1FBRTdGLHFCQUFxQjtRQUNyQixNQUFNb0IsY0FBYzlCLHVEQUEwQixDQUFDO1lBQzdDZ0MsU0FBUztZQUNUQyxNQUFNO2dCQUNKQyxNQUFNdEI7Z0JBQ051QixNQUFNckI7WUFDUjtRQUNGO1FBRUEsYUFBYTtRQUNiLE1BQU1nQixZQUFZTSxRQUFRLENBQUM7WUFDekJDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRXpCLFVBQVUsQ0FBQyxDQUFDO1lBQ3RDMEIsSUFBSTVCO1lBQ0o2QixTQUFTO1lBQ1RDLE1BQU0sQ0FBQzs7Ozs7O2NBTUMsRUFBRXRCLGlCQUFpQjs7Ozs7Ozs7OztNQVUzQixDQUFDO1FBQ0g7UUFFQSxPQUFPbkIscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUN2Qm9DLFNBQVM7WUFDVEMsU0FBUztRQUNYO0lBRUYsRUFBRSxPQUFPMUIsT0FBTztRQUNkWSxRQUFRWixLQUFLLENBQUMsb0NBQW9DQTtRQUNsRCxPQUFPakIscURBQVlBLENBQUNNLElBQUksQ0FDdEI7WUFBRVcsT0FBTztRQUFtQyxHQUM1QztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxhcm1hblxcRG93bmxvYWRzXFxyb2Jsb3gtYW5pbWUtY291bnRkb3duXFxhcHBcXGFwaVxcYWRtaW5cXHNlbmQtY29kZVxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5pbXBvcnQgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJ1xyXG5pbXBvcnQgeyB2ZXJpZmljYXRpb25Db2RlcyB9IGZyb20gJ0AvbGliL3ZlcmlmaWNhdGlvbi1zdG9yYWdlJ1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKClcclxuICAgIFxyXG4gICAgLy8gVmVyaWZ5IGFkbWluIHBhc3N3b3JkIGZpcnN0XHJcbiAgICBjb25zdCBhZG1pblBhc3N3b3JkID0gcHJvY2Vzcy5lbnYuQURNSU5fUEFTU1dPUkRcclxuICAgIGNvbnN0IGFkbWluRW1haWwgPSBwcm9jZXNzLmVudi5BRE1JTl9FTUFJTFxyXG4gICAgY29uc3QgZ21haWxVc2VyID0gcHJvY2Vzcy5lbnYuR01BSUxfVVNFUlxyXG4gICAgY29uc3QgZ21haWxBcHBQYXNzd29yZCA9IHByb2Nlc3MuZW52LkdNQUlMX0FQUF9QQVNTV09SRFxyXG4gICAgXHJcbiAgICBpZiAoIWFkbWluUGFzc3dvcmQgfHwgIWFkbWluRW1haWwgfHwgIWdtYWlsVXNlciB8fCAhZ21haWxBcHBQYXNzd29yZCkge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ1NlcnZlciBjb25maWd1cmF0aW9uIGluY29tcGxldGUnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHBhc3N3b3JkICE9PSBhZG1pblBhc3N3b3JkKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiAnSW52YWxpZCBwYXNzd29yZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAxIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHZW5lcmF0ZSA2LWRpZ2l0IHZlcmlmaWNhdGlvbiBjb2RlXHJcbiAgICBjb25zdCB2ZXJpZmljYXRpb25Db2RlID0gTWF0aC5mbG9vcigxMDAwMDAgKyBNYXRoLnJhbmRvbSgpICogOTAwMDAwKS50b1N0cmluZygpXHJcbiAgICBcclxuICAgIC8vIFN0b3JlIGNvZGUgd2l0aCAxMC1taW51dGUgZXhwaXJ5XHJcbiAgICB2ZXJpZmljYXRpb25Db2Rlcy5zZXQoYWRtaW5FbWFpbCwge1xyXG4gICAgICBjb2RlOiB2ZXJpZmljYXRpb25Db2RlLFxyXG4gICAgICBleHBpcmVzOiBEYXRlLm5vdygpICsgMTAgKiA2MCAqIDEwMDAgLy8gMTAgbWludXRlc1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coYEdlbmVyYXRlZCB2ZXJpZmljYXRpb24gY29kZSAke3ZlcmlmaWNhdGlvbkNvZGV9IGZvciAke2FkbWluRW1haWx9YCkgLy8gRGVidWcgbG9nXHJcbiAgICBcclxuICAgIC8vIENyZWF0ZSB0cmFuc3BvcnRlclxyXG4gICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XHJcbiAgICAgIHNlcnZpY2U6ICdnbWFpbCcsXHJcbiAgICAgIGF1dGg6IHtcclxuICAgICAgICB1c2VyOiBnbWFpbFVzZXIsXHJcbiAgICAgICAgcGFzczogZ21haWxBcHBQYXNzd29yZFxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBTZW5kIGVtYWlsXHJcbiAgICBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbCh7XHJcbiAgICAgIGZyb206IGBcIkFuaUJsb3ggQWRtaW5cIiA8JHtnbWFpbFVzZXJ9PmAsXHJcbiAgICAgIHRvOiBhZG1pbkVtYWlsLFxyXG4gICAgICBzdWJqZWN0OiAnQWRtaW4gUGFuZWwgVmVyaWZpY2F0aW9uIENvZGUnLFxyXG4gICAgICBodG1sOiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjsgbWF4LXdpZHRoOiA2MDBweDsgbWFyZ2luOiAwIGF1dG87XCI+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9XCJjb2xvcjogIzMzMzsgdGV4dC1hbGlnbjogY2VudGVyO1wiPkFkbWluIFBhbmVsIEFjY2VzczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZDogI2Y1ZjVmNTsgcGFkZGluZzogMjBweDsgYm9yZGVyLXJhZGl1czogMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPlxyXG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJjb2xvcjogIzY2NjtcIj5Zb3VyIHZlcmlmaWNhdGlvbiBjb2RlIGlzOjwvaDM+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6IDMycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogIzAwN2JmZjsgbWFyZ2luOiAyMHB4IDA7IGxldHRlci1zcGFjaW5nOiA1cHg7XCI+XHJcbiAgICAgICAgICAgICAgJHt2ZXJpZmljYXRpb25Db2RlfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPHAgc3R5bGU9XCJjb2xvcjogIzY2NjsgbWFyZ2luLXRvcDogMjBweDtcIj5cclxuICAgICAgICAgICAgICBUaGlzIGNvZGUgd2lsbCBleHBpcmUgaW4gMTAgbWludXRlcy5cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT1cImNvbG9yOiAjOTk5OyBmb250LXNpemU6IDE0cHg7XCI+XHJcbiAgICAgICAgICAgICAgSWYgeW91IGRpZG4ndCByZXF1ZXN0IHRoaXMgY29kZSwgcGxlYXNlIGlnbm9yZSB0aGlzIGVtYWlsLlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYFxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgXHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsIFxyXG4gICAgICBtZXNzYWdlOiAnVmVyaWZpY2F0aW9uIGNvZGUgc2VudCB0byB5b3VyIGVtYWlsJyBcclxuICAgIH0pXHJcbiAgICBcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyB2ZXJpZmljYXRpb24gY29kZTonLCBlcnJvcilcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBzZW5kIHZlcmlmaWNhdGlvbiBjb2RlJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgIClcclxuICB9XHJcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIm5vZGVtYWlsZXIiLCJ2ZXJpZmljYXRpb25Db2RlcyIsIlBPU1QiLCJyZXF1ZXN0IiwicGFzc3dvcmQiLCJqc29uIiwiYWRtaW5QYXNzd29yZCIsInByb2Nlc3MiLCJlbnYiLCJBRE1JTl9QQVNTV09SRCIsImFkbWluRW1haWwiLCJBRE1JTl9FTUFJTCIsImdtYWlsVXNlciIsIkdNQUlMX1VTRVIiLCJnbWFpbEFwcFBhc3N3b3JkIiwiR01BSUxfQVBQX1BBU1NXT1JEIiwiZXJyb3IiLCJzdGF0dXMiLCJ2ZXJpZmljYXRpb25Db2RlIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidG9TdHJpbmciLCJzZXQiLCJjb2RlIiwiZXhwaXJlcyIsIkRhdGUiLCJub3ciLCJjb25zb2xlIiwibG9nIiwidHJhbnNwb3J0ZXIiLCJjcmVhdGVUcmFuc3BvcnQiLCJzZXJ2aWNlIiwiYXV0aCIsInVzZXIiLCJwYXNzIiwic2VuZE1haWwiLCJmcm9tIiwidG8iLCJzdWJqZWN0IiwiaHRtbCIsInN1Y2Nlc3MiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/send-code/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/verification-storage.ts":
/*!*************************************!*\
  !*** ./lib/verification-storage.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   verificationCodes: () => (/* binding */ verificationCodes)\n/* harmony export */ });\n// Use global variable to ensure sharing between API routes in Next.js\n// Initialize global verification codes storage\nif (!global.verificationCodes) {\n    global.verificationCodes = new Map();\n}\nconst verificationCodes = global.verificationCodes;\n// Clean up expired codes periodically (only run once)\nif (!global.cleanupInterval) {\n    global.cleanupInterval = setInterval(()=>{\n        const now = Date.now();\n        for (const [email, data] of verificationCodes.entries()){\n            if (now > data.expires) {\n                verificationCodes.delete(email);\n            }\n        }\n    }, 60000) // Clean up every minute\n    ;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvdmVyaWZpY2F0aW9uLXN0b3JhZ2UudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHNFQUFzRTtBQUt0RSwrQ0FBK0M7QUFDL0MsSUFBSSxDQUFDQSxPQUFPQyxpQkFBaUIsRUFBRTtJQUM3QkQsT0FBT0MsaUJBQWlCLEdBQUcsSUFBSUM7QUFDakM7QUFFTyxNQUFNRCxvQkFBb0JELE9BQU9DLGlCQUFpQjtBQUV6RCxzREFBc0Q7QUFDdEQsSUFBSSxDQUFDRCxPQUFPRyxlQUFlLEVBQUU7SUFDM0JILE9BQU9HLGVBQWUsR0FBR0MsWUFBWTtRQUNuQyxNQUFNQyxNQUFNQyxLQUFLRCxHQUFHO1FBQ3BCLEtBQUssTUFBTSxDQUFDRSxPQUFPQyxLQUFLLElBQUlQLGtCQUFrQlEsT0FBTyxHQUFJO1lBQ3ZELElBQUlKLE1BQU1HLEtBQUtFLE9BQU8sRUFBRTtnQkFDdEJULGtCQUFrQlUsTUFBTSxDQUFDSjtZQUMzQjtRQUNGO0lBQ0YsR0FBRyxPQUFPLHdCQUF3Qjs7QUFDcEMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcYXJtYW5cXERvd25sb2Fkc1xccm9ibG94LWFuaW1lLWNvdW50ZG93blxcbGliXFx2ZXJpZmljYXRpb24tc3RvcmFnZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVc2UgZ2xvYmFsIHZhcmlhYmxlIHRvIGVuc3VyZSBzaGFyaW5nIGJldHdlZW4gQVBJIHJvdXRlcyBpbiBOZXh0LmpzXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgdmVyaWZpY2F0aW9uQ29kZXM6IE1hcDxzdHJpbmcsIHsgY29kZTogc3RyaW5nLCBleHBpcmVzOiBudW1iZXIgfT4gfCB1bmRlZmluZWRcclxufVxyXG5cclxuLy8gSW5pdGlhbGl6ZSBnbG9iYWwgdmVyaWZpY2F0aW9uIGNvZGVzIHN0b3JhZ2VcclxuaWYgKCFnbG9iYWwudmVyaWZpY2F0aW9uQ29kZXMpIHtcclxuICBnbG9iYWwudmVyaWZpY2F0aW9uQ29kZXMgPSBuZXcgTWFwPHN0cmluZywgeyBjb2RlOiBzdHJpbmcsIGV4cGlyZXM6IG51bWJlciB9PigpXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB2ZXJpZmljYXRpb25Db2RlcyA9IGdsb2JhbC52ZXJpZmljYXRpb25Db2Rlc1xyXG5cclxuLy8gQ2xlYW4gdXAgZXhwaXJlZCBjb2RlcyBwZXJpb2RpY2FsbHkgKG9ubHkgcnVuIG9uY2UpXHJcbmlmICghZ2xvYmFsLmNsZWFudXBJbnRlcnZhbCkge1xyXG4gIGdsb2JhbC5jbGVhbnVwSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXHJcbiAgICBmb3IgKGNvbnN0IFtlbWFpbCwgZGF0YV0gb2YgdmVyaWZpY2F0aW9uQ29kZXMuZW50cmllcygpKSB7XHJcbiAgICAgIGlmIChub3cgPiBkYXRhLmV4cGlyZXMpIHtcclxuICAgICAgICB2ZXJpZmljYXRpb25Db2Rlcy5kZWxldGUoZW1haWwpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCA2MDAwMCkgLy8gQ2xlYW4gdXAgZXZlcnkgbWludXRlXHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgY2xlYW51cEludGVydmFsOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZFxyXG59ICJdLCJuYW1lcyI6WyJnbG9iYWwiLCJ2ZXJpZmljYXRpb25Db2RlcyIsIk1hcCIsImNsZWFudXBJbnRlcnZhbCIsInNldEludGVydmFsIiwibm93IiwiRGF0ZSIsImVtYWlsIiwiZGF0YSIsImVudHJpZXMiLCJleHBpcmVzIiwiZGVsZXRlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/verification-storage.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fsend-code%2Froute&page=%2Fapi%2Fadmin%2Fsend-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fsend-code%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fsend-code%2Froute&page=%2Fapi%2Fadmin%2Fsend-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fsend-code%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_arman_Downloads_roblox_anime_countdown_app_api_admin_send_code_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/send-code/route.ts */ \"(rsc)/./app/api/admin/send-code/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"export\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/send-code/route\",\n        pathname: \"/api/admin/send-code\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/send-code/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\arman\\\\Downloads\\\\roblox-anime-countdown\\\\app\\\\api\\\\admin\\\\send-code\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_arman_Downloads_roblox_anime_countdown_app_api_admin_send_code_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRnNlbmQtY29kZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYWRtaW4lMkZzZW5kLWNvZGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhZG1pbiUyRnNlbmQtY29kZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhcm1hbiU1Q0Rvd25sb2FkcyU1Q3JvYmxveC1hbmltZS1jb3VudGRvd24lNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2FybWFuJTVDRG93bmxvYWRzJTVDcm9ibG94LWFuaW1lLWNvdW50ZG93biZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD1leHBvcnQmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDeUM7QUFDdEg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGFybWFuXFxcXERvd25sb2Fkc1xcXFxyb2Jsb3gtYW5pbWUtY291bnRkb3duXFxcXGFwcFxcXFxhcGlcXFxcYWRtaW5cXFxcc2VuZC1jb2RlXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcImV4cG9ydFwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hZG1pbi9zZW5kLWNvZGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi9zZW5kLWNvZGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL3NlbmQtY29kZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGFybWFuXFxcXERvd25sb2Fkc1xcXFxyb2Jsb3gtYW5pbWUtY291bnRkb3duXFxcXGFwcFxcXFxhcGlcXFxcYWRtaW5cXFxcc2VuZC1jb2RlXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fsend-code%2Froute&page=%2Fapi%2Fadmin%2Fsend-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fsend-code%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

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

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

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

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0","vendor-chunks/nodemailer@7.0.3"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fsend-code%2Froute&page=%2Fapi%2Fadmin%2Fsend-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fsend-code%2Froute.ts&appDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Carman%5CDownloads%5Croblox-anime-countdown&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=export&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();