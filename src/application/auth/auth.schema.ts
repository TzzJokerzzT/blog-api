import * as v from 'valibot';

export const LoginSchema = v.object({
  email: v.pipe(
    v.string('El email es requerido'),
    v.email('El email no es valido')
  ),
  password: v.pipe(
    v.string('La contrasena es requerida'),
    v.minLength(8, 'La contrasena debe tener minimo 8 caracteres')
  ),
});

export const RegisterSchema = v.object({
  name: v.pipe(
    v.string('El nombre es requerido'),
    v.minLength(2, 'El nombre debe tener minimo 2 caracteres'),
    v.maxLength(100, 'El nombre no puede exceder 100 caracteres')
  ),
  email: v.pipe(
    v.string('El email es requerido'),
    v.email('El email no es valido')
  ),
  password: v.pipe(
    v.string('La contrasena es requerida'),
    v.minLength(8, 'La contrasena debe tener minimo 8 caracteres'),
    v.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contrasena debe contener al menos una mayuscula, una minuscula y un numero'
    )
  ),
});

export const RefreshTokenSchema = v.object({
  refreshToken: v.string('El refresh token es requerido'),
});

export type LoginInput = v.InferOutput<typeof LoginSchema>;
export type RegisterInput = v.InferOutput<typeof RegisterSchema>;
export type RefreshTokenInput = v.InferOutput<typeof RefreshTokenSchema>;
