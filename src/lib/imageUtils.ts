import type { PhotoFilterType, CropData } from '@/types';

// Конфигурация CSS фильтров
export const FILTER_CONFIGS: Record<PhotoFilterType, string> = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  vintage: 'sepia(50%) contrast(90%) brightness(90%)',
  warm: 'saturate(150%) hue-rotate(-10deg) brightness(105%)',
  cool: 'saturate(90%) hue-rotate(10deg) brightness(95%)',
  dramatic: 'contrast(130%) saturate(120%) brightness(90%)',
  fade: 'contrast(90%) brightness(110%) saturate(80%)',
};

// Названия фильтров на русском
export const FILTER_NAMES: Record<PhotoFilterType, string> = {
  none: 'Оригинал',
  grayscale: 'Ч/Б',
  sepia: 'Сепия',
  vintage: 'Винтаж',
  warm: 'Тёплый',
  cool: 'Холодный',
  dramatic: 'Драма',
  fade: 'Выцветший',
};

/**
 * Применяет CSS фильтр к изображению через Canvas
 */
export async function applyFilter(
  imageUrl: string,
  filter: PhotoFilterType
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Применяем фильтр
      ctx.filter = FILTER_CONFIGS[filter];
      ctx.drawImage(img, 0, 0);

      // Возвращаем base64
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Обрезает изображение по заданным координатам
 */
export async function cropImage(
  imageUrl: string,
  cropData: CropData
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = cropData.width;
      canvas.height = cropData.height;

      ctx.drawImage(
        img,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropData.width,
        cropData.height
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Сжимает изображение до указанного размера
 */
export async function compressImage(
  file: File | Blob,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Вычисляем новые размеры, сохраняя пропорции
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Конвертирует File в base64 строку
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Создаёт миниатюру изображения
 */
export async function createThumbnail(
  imageUrl: string,
  size: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Квадратная миниатюра с центрированием
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Применяет настройки яркости/контраста/насыщенности
 */
export async function applyAdjustments(
  imageUrl: string,
  brightness: number = 100, // 0-200, 100 = normal
  contrast: number = 100,   // 0-200, 100 = normal
  saturation: number = 100  // 0-200, 100 = normal
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Проверяет, является ли строка валидным base64 изображением
 */
export function isValidImageData(data: string): boolean {
  return data.startsWith('data:image/');
}

/**
 * Получает размеры изображения
 */
export function getImageDimensions(
  imageUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}
