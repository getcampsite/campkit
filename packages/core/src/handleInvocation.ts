import { CampkitApplication } from 'campkit.application';

export function handleInvocation(options: any) {
  const { event, ...rest } = options;
  return new CampkitApplication(event, rest);
}
