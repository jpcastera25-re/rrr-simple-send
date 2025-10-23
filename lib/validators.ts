export function isEmail(v: string) {
  return /.+@.+\..+/.test(v);
}

export function isPhone(v: string) {
  // very light sanity check; Twilio will validate fully
  return /^\+?[1-9]\d{7,14}$/.test(v.replace(/[^\d+]/g, ""));
}
