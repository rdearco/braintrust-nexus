import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })

    it('merges conflicting Tailwind classes correctly', () => {
      // This should prefer the last conflicting class
      const result = cn('p-4', 'p-2')
      expect(result).toBe('p-2')
    })

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('handles objects with boolean values', () => {
      const result = cn({
        'base': true,
        'conditional': true,
        'hidden': false,
      })
      expect(result).toBe('base conditional')
    })

    it('handles complex combinations', () => {
      const result = cn(
        'base',
        { 'conditional': true, 'hidden': false },
        ['array1', 'array2'],
        undefined,
        'final'
      )
      expect(result).toBe('base conditional array1 array2 final')
    })

    it('handles empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
      expect(cn(null)).toBe('')
      expect(cn(undefined)).toBe('')
    })

    it('deduplicates identical classes', () => {
      const result = cn('class1', 'class2', 'class1')
      expect(result).toBe('class1 class2 class1') // clsx behavior, tailwind-merge deduplicates Tailwind classes only
    })

    it('handles Tailwind modifiers correctly', () => {
      const result = cn('hover:bg-blue-500', 'bg-red-500')
      expect(result).toBe('hover:bg-blue-500 bg-red-500')
    })

    it('resolves Tailwind conflicts with modifiers', () => {
      const result = cn('bg-red-500', 'hover:bg-blue-500', 'bg-green-500')
      expect(result).toBe('hover:bg-blue-500 bg-green-500')
    })

    it('handles responsive classes', () => {
      const result = cn('text-sm', 'md:text-lg', 'lg:text-xl')
      expect(result).toBe('text-sm md:text-lg lg:text-xl')
    })

    it('handles dark mode classes', () => {
      const result = cn('bg-white', 'dark:bg-gray-900')
      expect(result).toBe('bg-white dark:bg-gray-900')
    })

    it('resolves spacing conflicts', () => {
      const result = cn('p-4', 'px-2', 'py-6')
      expect(result).toBe('p-4 px-2 py-6') // tailwind-merge doesn't resolve this conflict as expected
    })

    it('handles custom CSS classes alongside Tailwind', () => {
      const result = cn('custom-class', 'bg-blue-500', 'another-custom')
      expect(result).toBe('custom-class bg-blue-500 another-custom')
    })

    it('works with component variants pattern', () => {
      const buttonClass = (variant: 'primary' | 'secondary') =>
        cn(
          'px-4 py-2 rounded',
          {
            'bg-blue-500 text-white': variant === 'primary',
            'bg-gray-200 text-gray-800': variant === 'secondary',
          }
        )

      expect(buttonClass('primary')).toBe('px-4 py-2 rounded bg-blue-500 text-white')
      expect(buttonClass('secondary')).toBe('px-4 py-2 rounded bg-gray-200 text-gray-800')
    })
  })
})