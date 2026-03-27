import sanitizeHtml from 'sanitize-html';

const allowedOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'ul', 'ol', 'li',
    'strong', 'em', 'code', 'pre', 'blockquote',
    'a', 'img',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https'],
};

export const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, allowedOptions);
};

export const sanitizeText = (dirty: string): string => {
  return sanitizeHtml(dirty, { allowedTags: [], allowedAttributes: {} });
};
