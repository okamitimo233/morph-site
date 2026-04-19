/**
 * Noop Image Service
 *
 * A passthrough image service that doesn't transform images.
 * Used in environments where Sharp is not available (e.g., Termux/Android).
 */

import type { LocalImageService, ImageTransform } from 'astro';
import { isESMImportedImage, isRemoteImage } from 'astro/assets/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImageConfig = Record<string, any>;

// Local transform type for the transform method
type LocalTransform = {
  src: string;
  format?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const noopService: LocalImageService = {
  propertiesToHash: ['src'],

  validateOptions(options) {
    // Basic validation
    if (!options.src) {
      throw new Error('Image src is required');
    }
    // Set default format
    if (!options.format) {
      if (isESMImportedImage(options.src) && options.src.format === 'svg') {
        options.format = 'svg';
      } else {
        options.format = 'jpeg';
      }
    }
    // Round dimensions
    if (options.width) options.width = Math.round(options.width);
    if (options.height) options.height = Math.round(options.height);
    return options;
  },

  getHTMLAttributes(options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, width, height, format, quality, densities, widths, formats, layout, priority, fit, position, background, ...attributes } = options;
    return {
      ...attributes,
      width: options.width,
      height: options.height,
      loading: attributes.loading ?? 'lazy',
      decoding: attributes.decoding ?? 'async',
    };
  },

  getSrcSet(_options: ImageTransform, _imageConfig: ImageConfig) {
    // Return empty array - no srcset for noop service
    return [];
  },

  getURL(options: ImageTransform, _imageConfig: ImageConfig) {
    // For ESM imported images, return the src directly
    if (isESMImportedImage(options.src)) {
      return options.src.src;
    }
    // For remote images, return the URL directly
    if (isRemoteImage(options.src)) {
      return options.src as string;
    }
    // For local paths, return as-is
    return options.src as string;
  },

  parseURL(_url: URL, _imageConfig: ImageConfig) {
    // No parsing needed for noop service
    return undefined;
  },

  async transform(inputBuffer: Uint8Array, transform: LocalTransform, _imageConfig: ImageConfig) {
    // Return the input buffer as-is (no transformation)
    return {
      data: inputBuffer,
      format: transform.format || 'jpeg',
    };
  },
};

export default noopService;
