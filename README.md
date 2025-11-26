# Roam Types

TypeScript type definitions for Roam Research's Roam Depot/Extension API and Roam Alpha API.

This package provides comprehensive TypeScript type definitions based on the official Roam Research developer documentation:

- [Roam Extension API](https://roamresearch.com/#/app/developer-documentation/page/y31lhjIqU)
- [Roam Alpha API](https://roamresearch.com/#/app/developer-documentation/page/tIaOPdXCj)

## Installation

```bash
npm install --save-dev roam-types
# or
yarn add -D roam-types
```

## Usage

### Roam Alpha API

The Roam Alpha API is the official API for interacting with Roam Research graphs programmatically. It is mounted on the `window` object in the Roam Research environment.

```typescript
import "roam-types"; // Import to enable global types
import type { QueryResult, PullResult } from "roam-types";

// RoamAlphaAPI 挂载在 window 上
if (window.roamAlphaAPI) {
  const api = window.roamAlphaAPI;

  // Query the graph using Datalog
  // QueryResult is an array of result objects
  const results: QueryResult[] = api.data.q(`
    [:find ?uid ?string
     :where [?b :block/uid ?uid]
            [?b :block/string ?string]]
  `);
  // results: [{ uid: "abc123", string: "Block content" }, ...]

  // Pull a block - returns BlockAttributes
  // PullResult is BlockAttributes with all block properties
  const block: PullResult = api.data.pull("[*]", [":block/uid", "abc123"]);
  // block contains: :db/id, :block/uid, :block/string, :block/children, etc.

  // Use async API (recommended for new extensions)
  const asyncResults = await api.data.async.q(
    "[:find ?uid :where [?b :block/uid ?uid]]"
  );

  // Create a block
  await api.data.block.create({
    location: {
      "parent-uid": "parent-uid-here",
      order: 0,
    },
    block: {
      string: "New block content",
    },
  });

  // Update a block
  await api.data.block.update({
    block: {
      uid: "abc123",
      string: "Updated content",
    },
  });

  // UI operations
  const focusedBlock = api.ui.getFocusedBlock();
  await api.ui.mainWindow.openBlock({ block: { uid: "abc123" } });
}
```

### Root-Level Convenience Methods

The Roam Alpha API also provides convenience methods at the root level for common operations:

```typescript
import "roam-types";
import type { QueryResult, PullResult } from "roam-types";

if (window.roamAlphaAPI) {
  const api = window.roamAlphaAPI;

  // Root-level query (same as api.data.q)
  const results: QueryResult = api.q(
    "[:find ?uid ?string :where [?b :block/uid ?uid] [?b :block/string ?string]]"
  );

  // Root-level pull (same as api.data.pull)
  const block: PullResult = api.pull("[*]", [":block/uid", "abc123"]);

  // Root-level block operations (convenience methods)
  await api.createBlock({
    location: { "parent-uid": "parent-uid", order: 0 },
    block: { string: "New block" },
  });

  await api.updateBlock({
    block: { uid: "abc123", string: "Updated content" },
  });

  await api.moveBlock({
    location: { "parent-uid": "new-parent", order: 0 },
    block: { uid: "abc123" },
  });

  await api.deleteBlock({
    block: { uid: "abc123" },
  });

  // Root-level page operations (convenience methods)
  await api.createPage({
    page: { title: "New Page" },
  });

  await api.updatePage({
    page: { uid: "page-uid", title: "Updated Title" },
  });

  await api.deletePage({
    page: { uid: "page-uid" },
  });
}
```

**Note:** These root-level methods are convenience wrappers around the `data` API methods. Both approaches are equivalent:

- `api.q()` is the same as `api.data.q()`
- `api.createBlock()` is the same as `api.data.block.create()`

### Roam Depot/Extension API

The Roam Depot/Extension API is used for developing Roam extensions.

```typescript
import type { RoamExtensionAPI, BlockContext, PageContext } from "roam-types";

// Extension entry point
export default async function onload(extensionAPI: RoamExtensionAPI) {
  // Register a block context menu button
  extensionAPI.ui.blockContextMenuButton({
    label: "My Action",
    action: (context: BlockContext) => {
      console.log("Block UID:", context["block-uid"]);
      extensionAPI.util.toast("Action executed!");
    },
  });

  // Register a command
  extensionAPI.command.register({
    id: "my-command",
    label: "My Command",
    callback: () => {
      extensionAPI.util.toast("Command executed!");
    },
  });

  // Create a sidebar panel
  const panel = extensionAPI.ui.sidebarPanel({
    tabTitle: "My Panel",
    component: MyComponent,
  });

  // Settings
  extensionAPI.settings.panel({
    tabTitle: "My Extension",
    settings: [
      {
        id: "my-setting",
        name: "My Setting",
        description: "A setting for my extension",
        action: {
          type: "switch",
        },
      },
    ],
  });
}
```

## API Reference

### Roam Alpha API

#### Main Interfaces

- `RoamAlphaAPI` - Main API interface mounted on `window.roamAlphaAPI`
  - Root-level convenience methods: `q()`, `pull()`, `createBlock()`, `updateBlock()`, `moveBlock()`, `deleteBlock()`, `createPage()`, `updatePage()`, `deletePage()`
- `DataAPI` - Data operations (queries, pulls, block/page operations)
- `UIAPI` - UI operations (windows, menus, components)
- `UtilAPI` - Utility functions
- `PlatformAPI` - Platform detection
- `GraphAPI` - Graph information
- `FileAPI` - File operations
- `UserAPI` - User information
- `DepotAPI` - Extension information
- `ConstantsAPI` - Constants

#### Data Types

- `BlockAttributes` - Complete block data structure with Datomic attributes
- `PullResult` - Result type for pull operations (alias of `BlockAttributes`)
- `QueryResult` - Result type for query operations
- `EntityId` - Entity identifier (number, string, or 2-tuple array)
- `EntityRef` - Entity reference with `:db/id`
- `BlockCreateParams`, `BlockUpdateParams`, `BlockMoveParams`, `BlockDeleteParams` - Block operation parameters
- `PageCreateParams`, `PageUpdateParams`, `PageDeleteParams` - Page operation parameters

### Roam Depot/Extension API

- `RoamExtensionAPI` - Main extension API interface
- `SettingsAPI` - Settings management
- `UIAPI` - UI element creation
- `CommandAPI` - Command registration
- `BlockAPI` - Block operations
- `PageAPI` - Page operations
- `GraphAPI` - Graph operations
- `UserAPI` - User information
- `UtilAPI` - Utility functions

## Type Definitions

This package provides comprehensive type definitions for:

1. **Roam Alpha API** (`roam-alpha-api.d.ts`)

   - **Root-Level Convenience Methods**

     - `q()` - Query the graph (same as `data.q()`)
     - `pull()` - Pull entity data (same as `data.pull()`)
     - `createBlock()` - Create a block (same as `data.block.create()`)
     - `updateBlock()` - Update a block (same as `data.block.update()`)
     - `moveBlock()` - Move a block (same as `data.block.move()`)
     - `deleteBlock()` - Delete a block (same as `data.block.delete()`)
     - `createPage()` - Create a page (same as `data.page.create()`)
     - `updatePage()` - Update a page (same as `data.page.update()`)
     - `deletePage()` - Delete a page (same as `data.page.delete()`)

   - **Data Operations** (`data`)

     - `q()` - Datalog queries returning `QueryResult[]`
     - `pull()` - Pull operations returning `PullResult` (BlockAttributes)
     - `pull_many()` - Pull multiple entities
     - `fast` - Fast read-only API
     - `async` - Async versions (recommended for new extensions)
     - `backend` - Backend queries
     - `addPullWatch()`, `removePullWatch()` - Watch for changes
     - `undo()`, `redo()` - Undo/redo operations
     - `block` - Block operations (create, update, move, delete, reorderBlocks)
     - `page` - Page operations (create, update, delete)
     - `user` - User operations (upsert)

   - **UI Operations** (`ui`)

     - Focus management (`getFocusedBlock`, `setBlockFocusAndSelection`)
     - Window operations (`mainWindow`, `leftSidebar`, `rightSidebar`)
     - Filters (`filters`)
     - Command palette and slash commands
     - Context menus (block, page, page ref, block ref, etc.)
     - Graph view callbacks
     - Component rendering (`renderBlock`, `renderPage`, `renderSearch`, `renderString`)

   - **Utilities** (`util`, `platform`, `graph`, `file`, `user`, `depot`, `constants`)

2. **Roam Depot/Extension API** (`roam-depot-api.d.ts`)
   - Extension lifecycle (`onload`, `onunload`)
   - Settings management
   - UI components (buttons, panels, windows)
   - Command registration
   - Block and page operations
   - Graph queries
   - Utility functions

### Data Structure Types

#### BlockAttributes

The `BlockAttributes` interface represents the complete structure of a block in Roam's Datomic database:

```typescript
interface BlockAttributes {
  ":db/id": number; // Entity ID
  ":block/uid": string; // Public block UID
  ":block/string": string; // Block content
  ":block/children": { ":db/id": number }[]; // Direct children
  ":block/parents": { ":db/id": number }[]; // All ancestors
  ":block/page": { ":db/id": number }; // Page reference
  ":block/order": number; // Order among siblings
  ":block/refs": { ":db/id": number }[]; // Referenced blocks
  // ... and more
}
```

#### QueryResult

The `QueryResult` interface represents query results with simplified property names:

```typescript
interface QueryResult {
  id?: number; // Entity ID
  uid?: string; // Block UID
  string?: string; // Block content
  time?: number; // Timestamp
  open?: boolean; // Open state
  order?: number; // Order
  children?: EntityRef[]; // Children
  parents?: EntityRef[]; // Parents
  page?: EntityRef; // Page reference
  user?: EntityRef; // User reference
  // ... and more
}
```

#### PullResult

`PullResult` is an alias for `BlockAttributes` and represents the result of pull operations.

## Development

```bash
# Install dependencies
npm install

# Type check
npm run test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

### Official Documentation

- [Roam Research](https://roamresearch.com/)
- [Roam Depot](https://roamresearch.com/#/app/roam-depot)
- [Roam Extension API Documentation](https://roamresearch.com/#/app/developer-documentation/page/y31lhjIqU)
- [Roam Alpha API Documentation](https://roamresearch.com/#/app/developer-documentation/page/tIaOPdXCj)

### Data Structure References

- [Deep Dive Into Roam's Data Structure](https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html) - Comprehensive guide to Roam's Datomic data structure
- [Learn Datalog Today!](http://www.learndatalogtoday.org/) - Learn how to write Datalog queries
- [Datomic Documentation](https://docs.datomic.com/) - Datomic query and pull documentation

## Notes

### Data Structure

Roam Research is built on a Datomic database. The type definitions reflect the actual structure:

- Blocks and pages are entities with `:db/id` (entity ID)
- Attributes use namespaced keywords (e.g., `:block/uid`, `:block/string`)
- Relationships (children, parents, page, user) are represented as entity references with `:db/id`
- Query results use simplified property names (e.g., `uid` instead of `:block/uid`)

### API Versions

- **Sync API** (`data.q()`, `data.pull()`) - Synchronous operations
- **Async API** (`data.async.q()`, `data.async.pull()`) - Promise-based (recommended for new extensions)
- **Fast API** (`data.fast.q()`) - Read-only, faster performance (~33% faster)
- **Backend API** (`data.backend.q()`) - Runs against backend (off-thread)
