export interface User {
  username: string;
  password: string;
}

export const users = {
  standard: {
    username: process.env.SAUCE_USER || 'standard_user',
    password: process.env.SAUCE_PASS || 'secret_sauce',
  } satisfies User,

  locked: {
    username: 'locked_out_user',
    password: process.env.SAUCE_PASS || 'secret_sauce',
  } satisfies User,

  glitch: {
    username: process.env.SAUCE_GLITCH_USER || 'performance_glitch_user',
    password: process.env.SAUCE_PASS || 'secret_sauce',
  } satisfies User,

  wrongPassword: {
    username: process.env.SAUCE_USER || 'standard_user',
    password: 'wrong_password',
  } satisfies User,
} as const;
