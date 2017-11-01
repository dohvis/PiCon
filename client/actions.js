export function incLeftSpeed(amount) {
  return { type: 'inc-leftspeed', amount };
}

export function decLeftSpeed(amount) {
  return { type: 'dec-leftspeed', amount };
}

export function incRightSpeed(amount) {
  return { type: 'inc-rightspeed', amount };
}

export function decRightSpeed(amount) {
  return { type: 'dec-rightspeed', amount };
}
