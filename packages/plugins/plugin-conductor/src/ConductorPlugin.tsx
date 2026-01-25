//
// Copyright 2023 DXOS.org
//

import * as Effect from 'effect/Effect';

import { Common, Plugin } from '@dxos/app-framework';
import { ComputeGraph } from '@dxos/conductor';
import { Obj } from '@dxos/echo';
import { type CreateObject } from '@dxos/plugin-space/types';
import { CanvasBoardType } from '@dxos/react-ui-canvas-editor';

import { ReactSurface } from './capabilities';
import { meta } from './meta';
import { translations } from './translations';

/**
 * Creates a CanvasBoard object.
 * Used by the plugin's createObject metadata function.
 */
export const createCanvasBoard: CreateObject = (props) =>
  Effect.sync(() => Obj.make(CanvasBoardType, props));

export const ConductorPlugin = Plugin.define(meta).pipe(
  Common.Plugin.addTranslationsModule({ translations }),
  Common.Plugin.addMetadataModule({
    metadata: {
      id: CanvasBoardType.typename,
      metadata: {
        icon: 'ph--infinity--regular',
        iconHue: 'sky',
        createObject: createCanvasBoard,
        addToCollectionOnCreate: true,
      },
    },
  }),
  Common.Plugin.addSchemaModule({ schema: [CanvasBoardType, ComputeGraph] }),
  Common.Plugin.addSurfaceModule({ activate: ReactSurface }),
  Plugin.make,
);
