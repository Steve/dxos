//
// Copyright 2025 DXOS.org
//

import * as Effect from 'effect/Effect';
import { describe, expect, test } from 'vitest';

import { Obj } from '@dxos/echo';
import { CanvasBoardType } from '@dxos/react-ui-canvas-editor';

import { createCanvasBoard } from './ConductorPlugin';

import { createCanvasBoard } from './ConductorPlugin';

describe('CanvasBoardType schema validation', () => {
  test('FAILS without layout field - reproduces the bug', ({ expect }) => {
    // This reproduces the exact error users see when clicking "Add to Space" -> "Circuit"
    // Error: ParseError: { name?: string | undefined; ... layout: ... }
    // └─ ["layout"]
    //    └─ is missing
    expect(() => {
      Obj.make(CanvasBoardType, {
        name: 'Test Circuit',
      });
    }).toThrow('is missing');
  });

  test('PASSES with required layout field', ({ expect }) => {
    // This shows the fix: provide default empty layout
    const board = Obj.make(CanvasBoardType, {
      name: 'Test Circuit',
      layout: { nodes: [], edges: [] },
    });

    expect(board.name).toBe('Test Circuit');
    expect(board.layout).toBeDefined();
    expect(board.layout.nodes).toEqual([]);
    expect(board.layout.edges).toEqual([]);
  });
});

describe('TDD: ConductorPlugin.createCanvasBoard function', () => {
  test('MUST handle props with just name (common user flow)', async ({ expect }) => {
    // This test validates the ACTUAL exported function at ConductorPlugin.tsx:21
    // The plugin's createObject uses this function at line 37
    //
    // User flow: Click "Add to Space" -> "Circuit", enter name "My Circuit"
    // Plugin calls: createCanvasBoard({ name: 'My Circuit' })
    // Expected: Valid CanvasBoard object with layout

    const board = await Effect.runPromise(createCanvasBoard({ name: 'My Circuit' }));

    expect(board.name).toBe('My Circuit');
    expect(board.layout).toBeDefined();
    expect(board.layout.nodes).toBeDefined();
    expect(board.layout.edges).toBeDefined();
  });

  test('MUST handle empty props (edge case)', async ({ expect }) => {
    // User flow: Click "Add to Space" -> "Circuit" without entering name
    // Plugin calls: createCanvasBoard({})
    // Expected: Valid CanvasBoard object with layout

    const board = await Effect.runPromise(createCanvasBoard({}));

    expect(board.layout).toBeDefined();
    expect(board.layout.nodes).toBeDefined();
    expect(board.layout.edges).toBeDefined();
  });

  test('MUST preserve custom layout when provided', async ({ expect }) => {
    // Advanced usage: User provides custom layout
    // Expected: Custom layout is preserved, not overwritten

    const customLayout = {
      id: 'custom-id',
      nodes: [{ id: 'node1', data: {} }],
      edges: [],
    };

    const board = await Effect.runPromise(createCanvasBoard({ layout: customLayout }));

    expect(board.layout.id).toBe('custom-id');
    expect(board.layout.nodes).toHaveLength(1);
    expect(board.layout.nodes[0].id).toBe('node1');
  });
});
