// store user id in local storage
import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId() {
  if (typeof window === 'undefined') return '';
  const key = 'soulr_user_id';
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(key, userId);
  }
  return userId;
}

export function hasVisitedOrb(orbId) {
  if (typeof window === 'undefined') return false;
  const key = `soulr_orb_visited_${orbId}`;
  return localStorage.getItem(key) === 'true';
}

export function markOrbVisited(orbId) {
  if (typeof window === 'undefined') return;
  const key = `soulr_orb_visited_${orbId}`;
  localStorage.setItem(key, 'true');
}
