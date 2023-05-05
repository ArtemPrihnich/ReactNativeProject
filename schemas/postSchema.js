import * as Yup from 'yup';

export const CreatePostSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Минимальная длина названия 3 символа!')
    .max(20, 'Максимальная длина названия 20 символов!')
    .required('Обязательное поле'),
  locationName: Yup.string()
    .max(40, 'Максимальная длина местоположения 40 символов!')
    .matches(
      /^[А-ЯA-Z]{1}[а-яa-z]{1,20}[-]{0,1}[А-ЯA-Z]{0,1}[а-яa-z]{0,10}[,]{1} [А-ЯA-Z]{1}[а-яa-z]{1,20}$/,
      'Введите местоположение в формате Регион, Страна'
    )
    .required('Обязательное поле'),
});
