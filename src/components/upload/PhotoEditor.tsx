import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Contrast, Droplets } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PhotoFilterType, PhotoEditOptions } from '@/types';
import { FILTER_CONFIGS } from '@/lib/imageUtils';
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

  const handleFilterChange = (filter: PhotoFilterType) => {
    setOptions(prev => ({ ...prev, filter }));
  };

  const handleSliderChange = (key: keyof PhotoEditOptions, value: number[]) => {
    setOptions(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleReset = () => {
    setOptions(defaultOptions);
  };

  const handleSave = () => {
    onSave(options);
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filters">Фильтры</TabsTrigger>
            <TabsTrigger value="adjust">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="mt-4">
            <FilterSelector
              imageUrl={imageUrl}
              selectedFilter={options.filter}
              onFilterSelect={handleFilterChange}
            />
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
