import * as Yup from 'yup';

export const SignupSchema = Yup.object().shape({
  login: Yup.string()
    .min(3, 'Минимальная длина логина 3 символа!')
    .max(20, 'Максимальная длина логина 30 символов!')
    .required('Обязательное поле'),
  email: Yup.string().email('Невалидная почта').required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Минимальная длина пароля 8 символов!')
    .max(30, 'Максимальная длина пароля 30 символов!')
    .required('Обязательное поле'),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Невалидная почта').required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Минимальная длина пароля 8 символов!')
    .max(30, 'Максимальная длина пароля 30 символов!')
    .required('Обязательное поле'),
});
