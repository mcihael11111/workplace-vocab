// ─── STANDARD API RESPONSE HELPERS ─────────────────────────────────────────
// All API responses use one of these shapes:
//   Success: { success: true,  data: <payload> }
//   Error:   { success: false, error: <message> }

export const apiResponse = {
  success(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
  },
  error(res, message, status = 500) {
    return res.status(status).json({ success: false, error: message });
  },
};
