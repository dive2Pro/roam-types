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

The Roam Depot/Extension API is used for developing Roam extensions. The API is scoped to your extension, ensuring no conflicts with other extensions.

```typescript
import type {
  RoamExtensionAPI,
  ExtensionCommandPaletteCommandParams,
} from "roam-types";

// Extension entry point
export default async function onload(extensionAPI: RoamExtensionAPI) {
  // Settings API - scoped to your extension, persisted across devices
  const mySetting = extensionAPI.settings.get("my-setting");
  extensionAPI.settings.set("my-setting", "value");
  const allSettings = extensionAPI.settings.getAll();

  // Create a settings panel with various setting types
  extensionAPI.settings.panel.create({
    tabTitle: "My Extension",
    settings: [
      {
        id: "button-setting", // Must be non-empty and cannot contain ".", "#", "$", "[", or "]"
        className: "ext-settings-panel-button-setting",
        name: "Button Test",
        description: "Tests the button",
        action: {
          type: "button",
          onClick: (evt) => {
            console.log("Button clicked!");
          },
          content: "Click Me",
        },
      },
      {
        id: "switch-setting",
        name: "Switch Test",
        description: "Toggle this setting",
        action: {
          type: "switch",
          onChange: (evt) => {
            console.log("Switch toggled!", evt);
          },
        },
      },
      {
        id: "input-setting",
        name: "Input Test",
        action: {
          type: "input",
          placeholder: "Enter text here",
          onChange: (evt) => {
            console.log("Input changed!", evt);
          },
        },
      },
      {
        id: "select-setting",
        name: "Select Test",
        action: {
          type: "select",
          items: ["Option 1", "Option 2", "Option 3"],
          onChange: (evt) => {
            console.log("Select changed!", evt);
          },
        },
      },
      {
        id: "text-setting",
        name: "Text Setting",
        description: "A text input setting",
        action: {
          type: "text",
          placeholder: "Enter text here",
        },
      },
      {
        id: "reactComponent-setting",
        name: "React Component Test",
        action: {
          type: "reactComponent",
          component: MyCustomComponent,
        },
      },
    ],
  });

  // Command Palette API - commands are associated with your extension
  // No need to call removeCommand on onunload - automatically cleaned up
  await extensionAPI.ui.commandPalette.addCommand({
    label: "My Command",
    callback: () => {
      console.log("Command executed!");
    },
    "default-hotkey": "ctrl+shift+m",
  });

  // Remove a command (optional - will be cleaned up automatically on unload)
  await extensionAPI.ui.commandPalette.removeCommand({
    label: "My Command",
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
  - `settings` - Settings API (scoped to extension, persisted across devices)
  - `ui` - UI API for adding UI elements
- `SettingsAPI` - Settings management
  - `get(key)` - Get a setting value
  - `set(key, value)` - Set a setting value
  - `getAll()` - Get all settings
  - `panel.create(config)` - Create a settings panel
- `ExtensionUIAPI` - Extension UI API
  - `commandPalette` - Command palette API (commands associated with extension)
- `ExtensionCommandPaletteAPI` - Command palette operations
  - `addCommand(params)` - Add a command (same as roamAlphaAPI, but associated with extension)
  - `removeCommand(params)` - Remove a command (no need to call on onunload - auto-cleaned)
- `ExtensionCommandPaletteCommandParams` - Command parameters
  - `label` - Command label
  - `callback` - Command callback function
  - `disable-hotkey?` - Disable hotkey
  - `default-hotkey?` - Default hotkey (string or array for multi-step)
- `SettingsPanelConfig` - Settings panel configuration
  - `tabTitle` - Tab title for the settings panel
  - `settings` - Array of setting configurations
- `SettingConfig` - Individual setting configuration
  - `id` - Setting ID (must be non-empty, cannot contain ".", "#", "$", "[", or "]")
  - `className?` - CSS class name for the setting
  - `name` - Setting display name
  - `description?` - Setting description (string or React element)
  - `action` - Setting action configuration (union type)
- `SettingAction` - Union type for setting actions
  - `ButtonSettingAction` - Button action (`type: "button"`, requires `onClick`, `content`)
  - `SwitchSettingAction` - Switch/toggle action (`type: "switch"`, optional `onChange`)
  - `InputSettingAction` - Input field action (`type: "input"`, optional `placeholder`, `onChange`)
  - `SelectSettingAction` - Select dropdown action (`type: "select"`, requires `items`, optional `onChange`)
  - `ReactComponentSettingAction` - Custom React component (`type: "reactComponent"`, requires `component`)
  - `TextSettingAction` - Text input action (`type: "text"`, optional `placeholder`, `onChange`)
  - `TextareaSettingAction` - Textarea input action (`type: "textarea"`, optional `placeholder`, `onChange`)
  - `NumberSettingAction` - Number input action (`type: "number"`, optional `placeholder`, `onChange`)

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
   - **Settings API** (`settings`)
     - `get(key)` - Get setting value
     - `set(key, value)` - Set setting value
     - `getAll()` - Get all settings
     - `panel.create(config)` - Create settings panel
     - Settings are scoped to your extension and persisted across devices
   - **UI API** (`ui`)
     - `commandPalette.addCommand(params)` - Add command to palette (associated with extension)
     - `commandPalette.removeCommand(params)` - Remove command (auto-cleaned on unload)
     - Commands added via extensionAPI are grouped by extension (e.g., in Hotkeys window)
     - No need to call `removeCommand` on `onunload` - automatically cleaned up

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

### Extension API Features

#### Settings API

The Settings API is scoped to your extension, ensuring no conflicts with other extensions:

- Settings are persisted across devices
- Use `settings.get(key)` to retrieve a setting value
- Use `settings.set(key, value)` to set a setting value
- Use `settings.getAll()` to get all settings as an object
- Use `settings.panel.create(config)` to create a settings panel

**Important:** Setting IDs must be non-empty strings and cannot contain ".", "#", "$", "[", or "]".

**Setting Action Types:**

The settings panel supports various action types:

1. **Button** (`type: "button"`)

   - Requires: `onClick` callback, `content` string
   - Example: `{ type: "button", onClick: (evt) => {...}, content: "Click Me" }`

2. **Switch** (`type: "switch"`)

   - Optional: `onChange` callback
   - Example: `{ type: "switch", onChange: (evt) => {...} }`

3. **Input** (`type: "input"`)

   - Optional: `placeholder`, `onChange` callback
   - Example: `{ type: "input", placeholder: "Enter text", onChange: (evt) => {...} }`

4. **Select** (`type: "select"`)

   - Requires: `items` array (string[])
   - Optional: `onChange` callback
   - Example: `{ type: "select", items: ["Option 1", "Option 2"], onChange: (evt) => {...} }`

5. **React Component** (`type: "reactComponent"`)

   - Requires: `component` (React component)
   - Example: `{ type: "reactComponent", component: MyComponent }`

6. **Text** (`type: "text"`)

   - Optional: `placeholder`, `onChange` callback
   - Example: `{ type: "text", placeholder: "Enter text", onChange: (evt) => {...} }`

7. **Textarea** (`type: "textarea"`)

   - Optional: `placeholder`, `onChange` callback
   - Example: `{ type: "textarea", placeholder: "Enter text", onChange: (evt) => {...} }`

8. **Number** (`type: "number"`)
   - Optional: `placeholder`, `onChange` callback
   - Example: `{ type: "number", placeholder: "Enter number", onChange: (evt) => {...} }`

**Setting Configuration:**

- `id` - Required, unique identifier (cannot contain ".", "#", "$", "[", or "]")
- `className` - Optional CSS class name
- `name` - Required display name
- `description` - Optional description (can be string or React element)
- `action` - Required action configuration (one of the types above)

#### Command Palette API

The Command Palette API allows you to add commands that are associated with your extension:

- Commands are automatically grouped by extension (e.g., in the Hotkeys window)
- Commands are automatically cleaned up when the extension is unloaded
- No need to call `removeCommand` in `onunload` - unlike `roamAlphaAPI.ui.commandPalette`
- Same API signature as `window.roamAlphaAPI.ui.commandPalette.addCommand`

**Migration from roamAlphaAPI:**

If you're migrating from `window.roamAlphaAPI.ui.commandPalette.addCommand`, simply replace it with `extensionAPI.ui.commandPalette.addCommand`. The commands will now be associated with your extension and automatically cleaned up on unload.
