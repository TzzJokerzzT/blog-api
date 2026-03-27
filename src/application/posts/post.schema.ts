import * as v from 'valibot';

export const CreatePostSchema = v.object({
  slug: v.pipe(
    v.string('El slug es requerido'),
    v.minLength(3, 'El slug debe tener minimo 3 caracteres'),
    v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minusculas, numeros y guiones')
  ),
  title: v.pipe(
    v.string('El titulo es requerido'),
    v.minLength(5, 'El titulo debe tener minimo 5 caracteres'),
    v.maxLength(200, 'El titulo no puede exceder 200 caracteres')
  ),
  excerpt: v.pipe(
    v.string('El excerpt es requerido'),
    v.minLength(10, 'El excerpt debe tener minimo 10 caracteres'),
    v.maxLength(500, 'El excerpt no puede exceder 500 caracteres')
  ),
  content: v.pipe(
    v.string('El contenido es requerido'),
    v.minLength(50, 'El contenido debe tener minimo 50 caracteres')
  ),
  date: v.pipe(
    v.string('La fecha es requerida'),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD')
  ),
  readTime: v.pipe(
    v.string('El tiempo de lectura es requerido'),
    v.regex(/^\d+ min read$/, 'El formato debe ser "X min read"')
  ),
  tags: v.array(v.string(), 'Los tags deben ser un arreglo de strings'),
  category: v.pipe(
    v.string('La categoria es requerida'),
    v.minLength(2, 'La categoria debe tener minimo 2 caracteres')
  ),
  featured: v.optional(v.boolean()),
});

export type CreatePostInput = v.InferOutput<typeof CreatePostSchema>;

export const UpdatePostSchema = v.object({
  slug: v.optional(v.pipe(
    v.string(),
    v.minLength(3, 'El slug debe tener minimo 3 caracteres'),
    v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minusculas, numeros y guiones')
  )),
  title: v.optional(v.pipe(
    v.string(),
    v.minLength(5, 'El titulo debe tener minimo 5 caracteres'),
    v.maxLength(200, 'El titulo no puede exceder 200 caracteres')
  )),
  excerpt: v.optional(v.pipe(
    v.string(),
    v.minLength(10, 'El excerpt debe tener minimo 10 caracteres'),
    v.maxLength(500, 'El excerpt no puede exceder 500 caracteres')
  )),
  content: v.optional(v.pipe(
    v.string(),
    v.minLength(50, 'El contenido debe tener minimo 50 caracteres')
  )),
  date: v.optional(v.pipe(
    v.string(),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD')
  )),
  readTime: v.optional(v.pipe(
    v.string(),
    v.regex(/^\d+ min read$/, 'El formato debe ser "X min read"')
  )),
  tags: v.optional(v.array(v.string())),
  category: v.optional(v.pipe(
    v.string(),
    v.minLength(2, 'La categoria debe tener minimo 2 caracteres')
  )),
  featured: v.optional(v.boolean()),
});

export type UpdatePostInput = v.InferOutput<typeof UpdatePostSchema>;
