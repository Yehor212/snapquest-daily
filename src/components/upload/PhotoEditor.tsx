import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Contrast, Droplets } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CropData, PhotoFilterType, PhotoEditOptions } from '@/types';
import { FILTER_CONFIGS, getImageDimensions } from '@/lib/imageUtils';
import { FilterSelector } from './FilterSelector';

interface PhotoEditorProps {
  imageUrl: string;
  initialOptions?: Partial<PhotoEditOptions>;
  onSave: (options: PhotoEditOptions) => void;
  onCancel: () => void;
}

const defaultOptions: PhotoEditOptions = {
  filter: 'none',
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

const defaultCropControls = {
  enabled: false,
  zoom: 100,
  offsetX: 0,
  offsetY: 0,
};

export function PhotoEditor({
  imageUrl,
  initialOptions,
  onSave,
  onCancel,
}: PhotoEditorProps) {
  const [options, setOptions] = useState<PhotoEditOptions>({
    ...defaultOptions,
    ...initialOptions,
  });
  const [cropEnabled, setCropEnabled] = useState(defaultCropControls.enabled);
  const [cropZoom, setCropZoom] = useState(defaultCropControls.zoom);
  const [cropOffsetX, setCropOffsetX] = useState(defaultCropControls.offsetX);
  const [cropOffsetY, setCropOffsetY] = useState(defaultCropControls.offsetY);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getImageDimensions(imageUrl)
      .then((size) => {
        if (isMounted) {
          setImageSize(size);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageSize(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!imageSize || !initialOptions?.crop) return;

    const minDim = Math.min(imageSize.width, imageSize.height);
    const cropSize = Math.max(1, initialOptions.crop.width);
    const zoom = Math.round((minDim / cropSize) * 100);
    const maxOffsetX = (imageSize.width - cropSize) / 2;
    const maxOffsetY = (imageSize.height - cropSize) / 2;
    const offsetX = maxOffsetX > 0
      ? Math.round(((initialOptions.crop.x - maxOffsetX) / maxOffsetX) * 100)
      : 0;
    const offsetY = maxOffsetY > 0
      ? Math.round(((initialOptions.crop.y - maxOffsetY) / maxOffsetY) * 100)
      : 0;

    setCropEnabled(true);
    setCropZoom(Math.max(100, Math.min(250, zoom)));
    setCropOffsetX(Math.max(-100, Math.min(100, offsetX)));
    setCropOffsetY(Math.max(-100, Math.min(100, offsetY)));
  }, [imageSize, initialOptions?.crop]);

  const handleFilterChange = (filter: PhotoFilterType) => {
    setOptions(prev => ({ ...prev, filter }));
  };

  const handleSliderChange = (key: keyof PhotoEditOptions, value: number[]) => {
    setOptions(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleReset = () => {
    setOptions(defaultOptions);
    setCropEnabled(defaultCropControls.enabled);
    setCropZoom(defaultCropControls.zoom);
    setCropOffsetX(defaultCropControls.offsetX);
    setCropOffsetY(defaultCropControls.offsetY);
  };

  const handleSave = () => {
    let crop: CropData | undefined;

    if (cropEnabled && imageSize) {
      const zoomFactor = cropZoom / 100;
      const minDim = Math.min(imageSize.width, imageSize.height);
      const cropSize = Math.min(minDim, Math.max(1, minDim / zoomFactor));
      const maxOffsetX = (imageSize.width - cropSize) / 2;
      const maxOffsetY = (imageSize.height - cropSize) / 2;
      const x = maxOffsetX + maxOffsetX * (cropOffsetX / 100);
      const y = maxOffsetY + maxOffsetY * (cropOffsetY / 100);

      crop = {
        x: Math.max(0, Math.min(imageSize.width - cropSize, Math.round(x))),
        y: Math.max(0, Math.min(imageSize.height - cropSize, Math.round(y))),
        width: Math.round(cropSize),
        height: Math.round(cropSize),
      };
    }

    onSave({ ...options, crop });
  };

  // Комбинированный CSS фильтр (фильтр + настройки)
  const filterConfig = FILTER_CONFIGS[options.filter];
  const adjustments = `brightness(${options.brightness}%) contrast(${options.contrast}%) saturate(${options.saturation}%)`;
  const combinedFilter = filterConfig !== 'none'
    ? `${filterConfig} ${adjustments}`
    : adjustments;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-secondary">
          <img
            src={imageUrl}
            alt="Edit preview"
            className="w-full h-full object-cover"
            style={{ filter: combinedFilter }}
          />
        </div>
      </div>

      {/* Editor Controls */}
      <div className="bg-card border-t border-border p-4 space-y-4">
        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="filters">Фильтры</TabsTrigger>
            <TabsTrigger value="crop">Обрезать</TabsTrigger>
            <TabsTrigger value="adjust">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="mt-4">
            <FilterSelector
              imageUrl={imageUrl}
              selectedFilter={options.filter}
              onFilterSelect={handleFilterChange}
            />
          </TabsContent>

          <TabsContent value="crop" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Обрезка</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (cropEnabled) {
                    setCropEnabled(false);
                    setCropZoom(defaultCropControls.zoom);
                    setCropOffsetX(defaultCropControls.offsetX);
                    setCropOffsetY(defaultCropControls.offsetY);
                  } else {
                    setCropEnabled(true);
                  }
                }}
              >
                {cropEnabled ? 'Сбросить' : 'Включить'}
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border border-border bg-secondary">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${50 + cropOffsetX / 2}% ${50 + cropOffsetY / 2}%`,
                    backgroundSize: cropEnabled ? `${cropZoom}%` : 'contain',
                    backgroundRepeat: 'no-repeat',
                    opacity: cropEnabled ? 1 : 0.8,
                  }}
                />
                {!cropEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Обрезка выключена
                  </div>
                )}
              </div>
            </div>

            {cropEnabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Масштаб</span>
                    <span className="text-sm text-muted-foreground">{cropZoom}%</span>
                  </div>
                  <Slider
                    value={[cropZoom]}
                    min={100}
                    max={250}
                    step={1}
                    onValueChange={(v) => setCropZoom(v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Смещение по X</span>
                    <span className="text-sm text-muted-foreground">{cropOffsetX}%</span>
                  </div>
                  <Slider
                    value={[cropOffsetX]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={(v) => setCropOffsetX(v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Смещение по Y</span>
                    <span className="text-sm text-muted-foreground">{cropOffsetY}%</span>
                  </div>
                  <Slider
                    value={[cropOffsetY]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={(v) => setCropOffsetY(v[0])}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="adjust" className="mt-4 space-y-6">
            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Яркость</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {options.brightness}%
                </span>
              </div>
              <Slider
                value={[options.brightness]}
                min={50}
                max={150}
                step={1}
                onValueChange={(v) => handleSliderChange('brightness', v)}
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Контраст</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {options.contrast}%
                </span>
              </div>
              <Slider
                value={[options.contrast]}
                min={50}
                max={150}
                step={1}
                onValueChange={(v) => handleSliderChange('contrast', v)}
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Насыщенность</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {options.saturation}%
                </span>
              </div>
              <Slider
                value={[options.saturation]}
                min={0}
                max={200}
                step={1}
                onValueChange={(v) => handleSliderChange('saturation', v)}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="w-full"
            >
              Сбросить настройки
            </Button>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Отмена
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Применить
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
