export const emailValidation = (email: string) => {
  if (/^\S+@stu\.najah\.edu$/.test(email)) {
    return "student";
  } else if (/^\S+@najah\.edu$/.test(email)) {
    return "supervisor";
  } else {
    return null;
  }
};
