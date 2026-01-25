//
// Copyright 2025 DXOS.org
//

import * as Effect from 'effect/Effect';
import { describe, expect, test } from 'vitest';

import { createCanvasBoard } from './ConductorPlugin';

describe('REFACTORING SAFETY: createCanvasBoard current behavior', () => {
  test('current behavior: THROWS when given props with just name', async ({ expect }) => {
    // This test documents the CURRENT (broken) behavior
    // Before refactoring: inline function threw this error
    // After refactoring: exported function should throw SAME error
    // If this test PASSES, refactoring was safe (no behavior change)

    await expect(Effect.runPromise(createCanvasBoard({ name: 'My Circuit' }))).rejects.toThrow('is missing');
  });

  test('current behavior: THROWS when given empty props', async ({ expect }) => {
    // This test documents the CURRENT (broken) behavior
    // Before refactoring: inline function threw this error
    // After refactoring: exported function should throw SAME error
    // If this test PASSES, refactoring was safe (no behavior change)

    await expect(Effect.runPromise(createCanvasBoard({}))).rejects.toThrow('is missing');
  });

  test('current behavior: SUCCEEDS when layout provided', async ({ expect }) => {
    // This test documents the CURRENT behavior that works
    // Before refactoring: inline function succeeded with layout
    // After refactoring: exported function should succeed SAME way
    // If this test PASSES, refactoring was safe (no behavior change)

    const board = await Effect.runPromise(
      createCanvasBoard({
        name: 'Test',
        layout: { nodes: [], edges: [] },
      }),
    );

    expect(board.name).toBe('Test');
    expect(board.layout).toBeDefined();
    expect(board.layout.nodes).toEqual([]);
    expect(board.layout.edges).toEqual([]);
  });
});
