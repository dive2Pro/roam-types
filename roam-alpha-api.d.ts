/**
 * Type definitions for Roam Research Alpha API
 * @see https://roamresearch.com/#/app/developer-documentation/page/tIaOPdXCj
 */


/**
 * Pull pattern string
 * Examples: "[*]", "[:block/string {:block/children ...}]"
 */
export type PullPattern = string;

/**
 * Entity ID in Roam database
 * Can be a database id (number) or entity unique identifier (string or 2-tuple array)
 * Examples: 24, "[:block/uid \"xyz\"]", [":block/uid", "xyz"]
 */
export type EntityId = number | string | [string, string];

/**
 * Block attributes in Roam database
 * Based on Datomic data structure
 * @see https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html
 */
export interface BlockAttributes {
    ":db/id": number;

    /**
     * The public ID - nine-character long block reference (e.g., "r61dfi2ZH")
     */
    ':block/uid': string;

    /**
     * The content string of the block
     */
    ':block/string': string;

    /**
     * Entity IDs of immediate children blocks (not grandchildren)
     */
    ':block/children': { ":db/id": number }[];

    /**
     * Entity IDs of ALL parent blocks (including grandparents, great grandparents, etc.)
     */
    ':block/parents': { ":db/id": number }[];
    ':block/page': { ":db/id": number };
    ':block/order': number;

    /**
     * Entity IDs of blocks referenced in this block
     */
    ':block/refs': { ":db/id": number }[];

    /**
     * Heading level (1-6) if this is a heading block
     */
    ':block/heading'?: number;

    /**
     * Text alignment
     */
    ':block/text-align'?: 'left' | 'center' | 'right' | 'justify';

    /**
     * Children view type
     */
    ':block/children-view-type'?: 'bullet' | 'document' | 'numbered';

    /**
     * Block view type
     */
    ':block/block-view-type'?: string;

    /**
     * Whether the block is open (expanded) or closed
     */
    ':block/open'?: boolean;

    /**
     * Email address of the person who created the block
     */
    ':create/email'?: string;
    ":create/user": { ":db/id": number };

    /**
     * Time in milliseconds since epoch (January 1, 1970 midnight UTC/GMT)
     */
    ':create/time'?: number;

    /**
     * Email address of the person who last edited the block
     */
    ':edit/email'?: string;
    ':edit/user': { ":db/id": number };
    ':edit/seen-by': { ":db/id": number }[];
    ':entity/attrs': {
        ":source": string[];
        ":value": string[];
    }[];

    /**
     * Time the block was last edited (milliseconds since epoch)
     */
    ':edit/time'?: number;


    /**
     * The page title
     */
    ':node/title'?: string;

    ":attrs/lookup": { ":db/id": number }[];
}


/**
 * Entity reference - used in nested structures (children, parents, page, user)
 */
export interface EntityRef {
    id: number; // Entity ID
}

export type PullResult = BlockAttributes;

export interface QueryResult {
    /**
     * Entity ID (database internal ID)
     */
    id?: number;

    /**
     * Block UID - nine-character long block reference (e.g., "g0LoUT-Cw")
     */
    uid?: string;

    /**
     * Block content string
     */
    string?: string;

    /**
     * Time in milliseconds since epoch
     * Could be create/time or edit/time depending on pull pattern
     */
    time?: number;

    /**
     * Whether the block is open (expanded) or closed
     */
    open?: boolean;

    /**
     * Order of the block among siblings (0-indexed)
     */
    order?: number;

    /**
     * Heading level (1-6) if this is a heading block
     */
    heading?: number;

    /**
     * Text alignment
     */
    'text-align'?: 'left' | 'center' | 'right' | 'justify';

    /**
     * Children view type
     */
    'children-view-type'?: 'bullet' | 'document' | 'numbered';

    /**
     * Block view type
     */
    'block-view-type'?: string;

    /**
     * Immediate children blocks (as entity references with id)
     * Only includes direct children, not grandchildren
     */
    children?: EntityRef[];

    /**
     * All parent blocks (as entity references with id)
     * Includes all ancestors (parents, grandparents, etc.)
     */
    parents?: EntityRef[];

    /**
     * Page this block belongs to (as entity reference with id)
     */
    page?: EntityRef;

    /**
     * User who created/edited the block (as entity reference with id)
     */
    user?: EntityRef;

    /**
     * Email address of the person who created the block
     */
    'create-email'?: string;

    /**
     * Time in milliseconds since epoch when block was created
     */
    'create-time'?: number;

    /**
     * Email address of the person who last edited the block
     */
    'edit-email'?: string;

    /**
     * Time in milliseconds since epoch when block was last edited
     */
    'edit-time'?: number;

    /**
     * For nested pull patterns or custom attributes
     */
    [key: string]: any;
}


/**
 * Fast API result - cljs object wrapped in js proxy (read-only)
 * This object should be treated as read-only and may not print to the console correctly
 * Key access includes the full namespaced key like obj[":block/string"]
 * 
 * @see https://blog.wsscode.com/alternative-to-clj-js/
 */
export type FastResult = {
    [key: string]: any; // Read-only proxy object
};

/**
 * Block location for create/move operations
 */
export interface BlockLocation {
    'parent-uid': string;
    order: number;
}

/**
 * Block properties
 */
export interface BlockProperties {
    uid?: string;
    string?: string;
    'page-uid'?: string;
    open?: boolean;
    heading?: number;
    'text-align'?: 'left' | 'center' | 'right' | 'justify';
    'children-view-type'?: 'bullet' | 'document' | 'numbered';
    'block-view-type'?: string;
}

/**
 * Block create parameters
 */
export interface BlockCreateParams {
    location: BlockLocation;
    block: BlockProperties;
}

/**
 * Block move parameters
 */
export interface BlockMoveParams {
    location: BlockLocation;
    block: {
        uid: string;
    };
}

/**
 * Block update parameters
 */
export interface BlockUpdateParams {
    block: {
        uid: string;
        string?: string;
        open?: boolean;
        heading?: number;
        'text-align'?: 'left' | 'center' | 'right' | 'justify';
        'children-view-type'?: 'bullet' | 'document' | 'numbered';
        'block-view-type'?: string;
        props?: Record<string, any>;
    };
}

/**
 * Block delete parameters
 */
export interface BlockDeleteParams {
    block: {
        uid: string;
    };
}

/**
 * Block reorder parameters
 */
export interface BlockReorderParams {
    location: {
        'parent-uid': string;
    };
    blocks: string[]; // Array of block UIDs in desired order
}

/**
 * Page create parameters
 */
export interface PageCreateParams {
    page: {
        title: string;
        uid?: string;
        'children-view-type'?: 'bullet' | 'document' | 'numbered';
    };
}

/**
 * Page update parameters
 */
export interface PageUpdateParams {
    page: {
        uid: string;
        title?: string;
        'children-view-type'?: 'bullet' | 'document' | 'numbered';
    };
}

/**
 * Page delete parameters
 */
export interface PageDeleteParams {
    page: {
        uid: string;
    };
}

/**
 * User upsert parameters
 */
export interface UserUpsertParams {
    'user-uid': string;
    'display-name'?: string;
}

/**
 * Pull watch callback function
 */
export type PullWatchCallback = (before: any, after: any) => void;

/**
 * Data API
 */
export interface DataAPI {
    /**
     * Query the graph using datomic flavored datalog
     * @param query - Datalog query string
     * @param args - Additional query arguments
     * @returns Query results
     * @throws Error with message "Query and/or pull expression took too long to run." if timeout (20 seconds)
     */
    q(query: string, ...args: any[]): QueryResult[];

    /**
     * A declarative way to make hierarchical (and possibly nested) selections of information about entities
     * @param pattern - Pull pattern string (e.g., "[*]", "[:block/string {:block/children ...}]")
     * @param eid - Entity ID (database id, entity unique identifier, or 2-tuple array)
     * @returns Pulled entity data
     * @throws Error with message "Query and/or pull expression took too long to run." if timeout (20 seconds)
     */
    pull(pattern: PullPattern, eid: EntityId): PullResult;

    /**
     * Same as pull but for multiple entities
     * @param pattern - Pull pattern string
     * @param eids - Array of entity IDs
     * @returns Array of pulled entity data
     * @throws Error with message "Query and/or pull expression took too long to run." if timeout (20 seconds)
     */
    pull_many(pattern: PullPattern, eids: EntityId[]): PullResult[];

    /**
     * Fast API - uses experimental clojurescript to javascript conversion for speed
     * Returns read-only cljs object wrapped in js proxy
     */
    fast: {
        /**
         * Fast version of q - around 33% faster
         * @param query - Datalog query string
         * @param args - Additional query arguments
         * @returns Read-only proxy object (cljs wrapped in js proxy)
         * @throws Error with message "Query and/or pull expression took too long to run." if timeout (20 seconds)
         */
        q(query: string, ...args: any[]): PullResult[];
    };

    /**
     * Async API - returns promises (preferred for new extensions)
     */
    async: {
        /**
         * Async version of q
         * @param query - Datalog query string
         * @param args - Additional query arguments
         * @returns Promise resolving to query results
         */
        q(query: string, ...args: any[]): Promise<QueryResult[]>;

        /**
         * Async version of pull
         * @param pattern - Pull pattern string
         * @param eid - Entity ID
         * @returns Promise resolving to pulled entity data
         */
        pull(pattern: PullPattern, eid: EntityId): Promise<PullResult>;

        /**
         * Async version of pull_many
         * @param pattern - Pull pattern string
         * @param eids - Array of entity IDs
         * @returns Promise resolving to array of pulled entity data
         */
        pull_many(pattern: PullPattern, eids: EntityId[]): Promise<PullResult[]>;

        /**
         * Async version of fast.q
         * @param query - Datalog query string
         * @param args - Additional query arguments
         * @returns Promise resolving to fast result
         */
        fast: {
            q(query: string, ...args: any[]): Promise<PullResult[]>;
        };
    };

    /**
     * Backend API - runs against the backend (off thread)
     * Falls back to local if backend unavailable (encrypted or offline)
     */
    backend: {
        /**
         * Backend version of q
         * @param query - Datalog query string
         * @param args - Additional query arguments
         * @returns Query results
         */
        q(query: string, ...args: any[]): QueryResult;
    };

    /**
     * Watches for changes on pull patterns on blocks and pages
     * @param pattern - Pull pattern string
     * @param entityId - Entity ID string
     * @param callback - Callback function receiving before and after state
     * @returns Promise which resolves once operation has completed
     */
    addPullWatch(pattern: string, entityId: string, callback: PullWatchCallback): Promise<void>;

    /**
     * Removes pull watch
     * @param pattern - Pull pattern string
     * @param entityId - Entity ID string
     * @param callback - Optional callback function (if not provided, clears all watches from pull pattern)
     * @returns Promise which resolves once operation has completed
     */
    removePullWatch(pattern: string, entityId: string, callback?: PullWatchCallback): Promise<void>;

    /**
     * Undo operation
     * @returns Promise which resolves once operation has completed
     */
    undo(): Promise<void>;

    /**
     * Redo operation
     * @returns Promise which resolves once operation has completed
     */
    redo(): Promise<void>;

    /**
     * Block operations
     */
    block: {
        /**
         * Creates a new block at a location
         * @param params - Block create parameters
         * @returns Promise which resolves once operation has completed
         */
        create(params: BlockCreateParams): Promise<void>;

        /**
         * Move a block to a new location
         * @param params - Block move parameters
         * @returns Promise which resolves once operation has completed
         */
        move(params: BlockMoveParams): Promise<void>;

        /**
         * Updates a block's text and/or other properties
         * @param params - Block update parameters
         * @returns Promise which resolves once operation has completed
         */
        update(params: BlockUpdateParams): Promise<void>;

        /**
         * Delete a block and all its children
         * @param params - Block delete parameters
         * @returns Promise which resolves once operation has completed
         */
        delete(params: BlockDeleteParams): Promise<void>;

        /**
         * Reorders blocks according to the order provided in the array
         * @param params - Block reorder parameters
         * @returns Promise which resolves once operation has completed
         */
        reorderBlocks(params: BlockReorderParams): Promise<void>;
    };

    /**
     * Page operations
     */
    page: {
        /**
         * Creates a new page with a given title
         * @param params - Page create parameters
         * @returns Promise which resolves once operation has completed
         */
        create(params: PageCreateParams): Promise<void>;

        /**
         * Updates a page's title and/or its children-view-type
         * @param params - Page update parameters
         * @returns Promise which resolves once operation has completed
         */
        update(params: PageUpdateParams): Promise<void>;

        /**
         * Delete a page and all its children blocks
         * @param params - Page delete parameters
         * @returns Promise which resolves once operation has completed
         */
        delete(params: PageDeleteParams): Promise<void>;
    };

    /**
     * User operations
     */
    user: {
        /**
         * Creates and/or updates user entity
         * @param params - User upsert parameters
         * @returns Promise which resolves once operation has completed
         */
        upsert(params: UserUpsertParams): Promise<void>;
    };
}

/**
 * Focused block metadata
 */
export interface FocusedBlock {
    'block-uid': string;
    'window-id': string;
}

/**
 * Block selection
 */
export interface BlockSelection {
    start: number;
    end?: number;
}

/**
 * Set block focus parameters
 */
export interface SetBlockFocusParams {
    location?: {
        'block-uid': string;
        'window-id': string | 'main-window';
    };
    selection?: BlockSelection;
}

/**
 * Main window operations
 */
export interface MainWindowAPI {
    /**
     * Opens a block with the given uid
     * @param params - Block parameters
     * @returns Promise which resolves once operation has completed (returns true even if block doesn't exist)
     */
    openBlock(params: { block: { uid: string } }): Promise<boolean>;

    /**
     * Opens a page with the given title or uid
     * @param params - Page parameters
     * @returns Promise which resolves once operation has completed (returns true even if page doesn't exist)
     */
    openPage(params: { page: { title?: string; uid?: string } }): Promise<boolean>;

    /**
     * Opens the daily notes / logs in the main window
     * @returns Promise which resolves once operation has completed
     */
    openDailyNotes(): Promise<void>;

    /**
     * Returns the uid string of the page/block currently open in the main window
     * @returns UID string
     */
    getOpenPageOrBlockUid(): string;

    /**
     * Focuses on the first block in the main window
     */
    focusFirstBlock(): void;
}

/**
 * Sidebar window
 */
export interface SidebarWindow {
    type: 'mentions' | 'block' | 'outline' | 'graph' | 'search-query';
    'block-uid'?: string;
    'search-query-str'?: string;
    'window-id': string;
    'pinned-to-top?'?: boolean;
    order?: number;
}

/**
 * Right sidebar operations
 */
export interface RightSidebarAPI {
    /**
     * Makes the right sidebar visible
     * @returns Promise which resolves once operation has completed
     */
    open(): Promise<void>;

    /**
     * Makes the right sidebar invisible but keeps the open windows
     * @returns Promise which resolves once operation has completed
     */
    close(): Promise<void>;

    /**
     * Returns an array of all open windows
     * @returns Array of sidebar windows
     */
    getWindows(): SidebarWindow[];

    /**
     * Adds a window to the right sidebar
     * @param params - Window parameters
     * @returns Promise which resolves once operation has completed
     */
    addWindow(params: {
        window: {
            type: 'mentions' | 'block' | 'outline' | 'graph' | 'search-query';
            'block-uid'?: string;
            'search-query-str'?: string;
            order?: number;
        };
    }): Promise<void>;

    /**
     * Removes a window from the right sidebar
     * @param params - Window parameters
     * @returns Promise which resolves once operation has completed
     */
    removeWindow(params: { window: SidebarWindow }): Promise<void>;

    /**
     * Expands a window
     * @param params - Window parameters
     * @returns Promise which resolves once operation has completed
     */
    expandWindow(params: { window: SidebarWindow }): Promise<void>;

    /**
     * Collapses a window
     * @param params - Window parameters
     * @returns Promise which resolves once operation has completed
     */
    collapseWindow(params: { window: SidebarWindow }): Promise<void>;

    /**
     * Pins a window
     * @param params - Window parameters with optional pin-to-top flag
     * @returns Promise which resolves once operation has completed
     */
    pinWindow(params: {
        window: SidebarWindow;
        'pin-to-top?'?: boolean;
    }): Promise<void>;

    /**
     * Unpins a window
     * @param params - Window parameters
     * @returns Promise which resolves once operation has completed
     */
    unpinWindow(params: { window: SidebarWindow }): Promise<void>;

    /**
     * Sets window order
     * @param params - Window parameters with order
     * @returns Promise which resolves once operation has completed
     */
    setWindowOrder(params: {
        window: SidebarWindow;
        order: number;
    }): Promise<void>;
}

/**
 * Page filters
 */
export interface PageFilters {
    includes?: string[];
    removes?: string[];
}

/**
 * Filters API
 */
export interface FiltersAPI {
    /**
     * Adds a global filter
     * @param params - Filter parameters
     * @returns Promise which resolves once operation has completed
     */
    addGlobalFilter(params: { title: string; type: 'includes' | 'removes' }): Promise<void>;

    /**
     * Removes a global filter
     * @param params - Filter parameters
     * @returns Promise which resolves once operation has completed
     */
    removeGlobalFilter(params: { title: string; type: 'includes' | 'removes' }): Promise<void>;

    /**
     * Returns a list of global filters currently in place
     * @returns Object with "includes" and "removes" arrays
     */
    getGlobalFilters(): PageFilters;

    /**
     * Returns a list of filters for a page
     * @param params - Page parameters
     * @returns Object with "includes" and "removes" arrays
     */
    getPageFilters(params: { page: { uid?: string; title?: string } }): PageFilters;

    /**
     * Returns a list of filters for a page's linked references
     * @param params - Page parameters
     * @returns Object with "includes" and "removes" arrays
     */
    getPageLinkedRefsFilters(params: { page: { uid?: string; title?: string } }): PageFilters;

    /**
     * Returns a list of filters for a sidebar window
     * @param params - Window parameters
     * @returns Object with "includes" and "removes" arrays
     */
    getSidebarWindowFilters(params: { window: { type: string; 'block-uid': string } }): PageFilters;

    /**
     * Set a page's filters
     * @param params - Page and filter parameters
     * @returns Promise which resolves once operation has completed
     */
    setPageFilters(params: { page: { uid?: string; title?: string }; filters: PageFilters }): Promise<void>;

    /**
     * Set a page linked references' filters
     * @param params - Page and filter parameters
     * @returns Promise which resolves once operation has completed
     */
    setPageLinkedRefsFilters(params: { page: { uid?: string; title?: string }; filters: PageFilters }): Promise<void>;

    /**
     * Set the filters for a right sidebar window
     * @param params - Window and filter parameters
     * @returns Promise which resolves once operation has completed
     */
    setSidebarWindowFilters(params: {
        window: { type: string; 'block-uid': string };
        filters: PageFilters;
    }): Promise<void>;
}

/**
 * Command palette command parameters
 */
export interface CommandPaletteCommandParams {
    label: string;
    callback: () => void;
    'disable-hotkey'?: boolean;
    'default-hotkey'?: string | string[]; // String or vector of strings for multi-step hotkeys
}

/**
 * Command palette API
 */
export interface CommandPaletteAPI {
    /**
     * Adds a command to the Command Palette
     * @param params - Command parameters
     * @returns Promise which resolves once operation has completed
     */
    addCommand(params: CommandPaletteCommandParams): Promise<void>;

    /**
     * Removes a command from the Command Palette
     * @param params - Command label
     * @returns Promise which resolves once operation has completed
     */
    removeCommand(params: { label: string }): Promise<void>;
}

/**
 * Slash command context
 */
export interface SlashCommandContext {
    'block-uid': string;
    'window-id': string;
    indexes: number[];
}

/**
 * Slash command parameters
 */
export interface SlashCommandParams {
    label: string;
    'display-conditional'?: (context: SlashCommandContext) => boolean;
    callback: (context: SlashCommandContext) => string | null;
}

/**
 * Slash command API
 */
export interface SlashCommandAPI {
    /**
     * Adds a command to the Slash Command
     * @param params - Command parameters
     * @returns null
     */
    addCommand(params: SlashCommandParams): null;

    /**
     * Removes a command from the Slash Command
     * @param params - Command label
     * @returns null
     */
    removeCommand(params: { label: string }): null;
}

/**
 * Block context for context menu
 */
export interface BlockContext {
    'block-string': string;
    'block-uid': string;
    heading: number | null;
    'page-uid': string;
    'read-only?': boolean;
    'window-id': string;
}

/**
 * Page context for context menu
 */
export interface PageContext {
    'page-uid': string;
    'page-title': string;
    'window-id': string;
}

/**
 * Page link context
 */
export interface PageLinkContext {
    'page-uid': string;
    'page-title': string;
}

/**
 * Page ref context
 */
export interface PageRefContext {
    'ref-uid': string;
    'block-uid': string;
    'window-id': string;
    indexes: number[];
    type: 'page-ref' | 'attribute' | 'tag' | 'multitag' | 'inline-link';
}

/**
 * Block ref context
 */
export interface BlockRefContext {
    'ref-uid': string;
    'block-uid': string;
    'window-id': string;
    indexes: number[];
}

/**
 * Context menu command parameters
 */
export interface ContextMenuCommandParams<T = any> {
    label: string;
    'display-conditional'?: (context: T) => boolean;
    callback: (context: T) => void;
}

/**
 * Context menu API
 */
export interface ContextMenuAPI<T = any> {
    /**
     * Adds a command to the context menu
     * @param params - Command parameters
     * @returns Promise which resolves once operation has completed (or null)
     */
    addCommand(params: ContextMenuCommandParams<T>): Promise<void> | null;

    /**
     * Removes a command from the context menu
     * @param params - Command label
     * @returns null
     */
    removeCommand(params: { label: string }): null;
}

/**
 * Multi-select context menu API
 */
export interface MultiSelectContextMenuAPI {
    /**
     * Adds a command to the multi-select context menu
     * @param params - Command parameters
     */
    addCommand(params: {
        label: string;
        'display-conditional'?: () => boolean;
        callback: () => void;
    }): void;

    /**
     * Removes a command from the multi-select context menu
     * @param params - Command label
     */
    removeCommand(params: { label: string }): void;
}

/**
 * Graph view callback context
 */
export interface GraphViewCallbackContext {
    cytoscape: any; // Cytoscape Core object
    elements: Array<{
        id: string;
        name?: string;
        weight?: number;
        source?: string;
        target?: string;
    }>;
    type: 'page' | 'all-pages';
}

/**
 * Graph view API
 */
export interface GraphViewAPI {
    /**
     * Adds a callback that gets called whenever a graph view is loaded
     * @param params - Callback parameters
     * @returns Promise which resolves once operation has completed
     */
    addCallback(params: {
        label: string;
        callback: (context: GraphViewCallbackContext) => void;
        type?: 'page' | 'all-pages';
    }): Promise<void>;

    /**
     * Removes a callback
     * @param params - Callback label
     * @returns Promise which resolves once operation has completed
     */
    removeCallback(params: { label: string }): Promise<void>;

    /**
     * Whole graph API (for new graph overview)
     */
    wholeGraph: {
        addCallback(params: { label: string; callback: (x: any) => void }): void;
        removeCallback(params: { label: string }): void;
        setExplorePages(pages: string[]): void;
        getExplorePages(): string[];
        setMode(mode: 'Whole Graph' | 'Explore'): void;
    };
}

/**
 * Render block parameters
 */
export interface RenderBlockParams {
    uid: string;
    el: HTMLElement;
    'open?'?: boolean;
    'zoom-path?'?: boolean;
    'zoom-start-after-uid'?: string;
}

/**
 * Render page parameters
 */
export interface RenderPageParams {
    uid: string;
    el: HTMLElement;
    'hide-mentions?'?: boolean;
}

/**
 * Render search parameters
 */
export interface RenderSearchParams {
    'search-query-str': string;
    el: HTMLElement;
    'closed?'?: boolean;
    'group-by-page?'?: boolean;
    'hide-paths?'?: boolean;
    'config-changed-callback'?: (config: any) => void;
}

/**
 * Components API
 */
export interface ComponentsAPI {
    /**
     * Mounts a React component that renders a given block with children
     * @param params - Render block parameters
     * @returns Promise which resolves once operation has completed
     */
    renderBlock(params: RenderBlockParams): Promise<void>;

    /**
     * Mounts a React component that renders a given page with children
     * @param params - Render page parameters
     * @returns Promise which resolves once operation has completed
     */
    renderPage(params: RenderPageParams): Promise<void>;

    /**
     * Mounts a React component that renders search results
     * @param params - Render search parameters
     */
    renderSearch(params: RenderSearchParams): void;

    /**
     * Mounts a React component that renders the passed-in string
     * @param params - String and element parameters
     * @returns Promise which resolves once operation has completed
     */
    renderString(params: { string: string; el: HTMLElement }): Promise<void>;

    /**
     * Unmounts a React component from a DOM node
     * @param params - Element parameter
     * @returns Promise which resolves once operation has completed
     */
    unmountNode(params: { el: HTMLElement }): Promise<void>;
}

/**
 * UI API
 */
export interface UIAPI {
    /**
     * Returns metadata about the currently focused block (or null if no block is focused)
     * @returns Focused block metadata or null
     */
    getFocusedBlock(): FocusedBlock | null;

    /**
     * Focuses on the given block and window pair
     * @param params - Focus and selection parameters
     */
    setBlockFocusAndSelection(params: SetBlockFocusParams): void;

    /**
     * Main window operations
     */
    mainWindow: MainWindowAPI;

    /**
     * Left sidebar operations
     */
    leftSidebar: {
        /**
         * Makes the left sidebar visible
         * @returns Promise which resolves once operation has completed
         */
        open(): Promise<void>;

        /**
         * Closes/hides the left sidebar
         * @returns Promise which resolves once operation has completed
         */
        close(): Promise<void>;
    };

    /**
     * Right sidebar operations
     */
    rightSidebar: RightSidebarAPI;

    /**
     * Filters operations
     */
    filters: FiltersAPI;

    /**
     * Command palette operations
     */
    commandPalette: CommandPaletteAPI;

    /**
     * Slash command operations
     */
    slashCommand: SlashCommandAPI;

    /**
     * Individual multiselect operations
     */
    individualMultiselect: {
        /**
         * Gets the uids currently selected by individual multiselect
         * @returns Array of selected UIDs
         */
        getSelectedUids(): string[];
    };

    /**
     * Block context menu operations
     */
    blockContextMenu: ContextMenuAPI<BlockContext>;

    /**
     * Page context menu operations
     */
    pageContextMenu: ContextMenuAPI<PageContext>;

    /**
     * Page link context menu operations
     */
    pageLinkContextMenu: ContextMenuAPI<PageLinkContext>;

    /**
     * Page ref context menu operations
     */
    pageRefContextMenu: ContextMenuAPI<PageRefContext>;

    /**
     * Block ref context menu operations
     */
    blockRefContextMenu: ContextMenuAPI<BlockRefContext>;

    /**
     * Multi-select context menu operations
     */
    msContextMenu: MultiSelectContextMenuAPI;

    /**
     * Graph view operations
     */
    graphView: GraphViewAPI;

    /**
     * Component rendering operations
     */
    components: ComponentsAPI;
}

/**
 * Util API
 */
export interface UtilAPI {
    /**
     * Generates a roam block UID (random string of length nine)
     * @returns Generated UID string
     */
    generateUID(): string;

    /**
     * Convert a daily note page title to a date
     * @param title - Daily note title string (e.g., "June 16th, 2022")
     * @returns Date object or null if not a daily note title
     */
    pageTitleToDate(title: string): Date | null;

    /**
     * Convert a date to a daily note page title
     * @param date - JavaScript Date object
     * @returns Daily note page title string
     */
    dateToPageTitle(date: Date): string;

    /**
     * Convert a date to a daily note page uid (e.g., "06-16-2022")
     * @param date - JavaScript Date object
     * @returns Daily note page UID string
     */
    dateToPageUid(date: Date): string;

    /**
     * Upload a file to Roam (deprecated, use file.upload instead)
     * @param params - File upload parameters
     * @returns Promise that resolves to a firebase download url
     * @deprecated Use file.upload instead
     */
    uploadFile(params: { file: File; toast?: { hide?: boolean } }): Promise<string>;
}

/**
 * Platform detection API
 */
export interface PlatformAPI {
    /**
     * True if client is Roam Desktop App
     */
    readonly isDesktop: boolean;

    /**
     * True if client is Roam Mobile App
     */
    readonly isMobileApp: boolean;

    /**
     * True if screen size is mobile (max-width: 450px)
     */
    readonly isMobile: boolean;

    /**
     * True if client is iPhone, iPad or iPod
     */
    readonly isIOS: boolean;

    /**
     * True if client is a PC
     */
    readonly isPC: boolean;

    /**
     * True if client is a touch device
     */
    readonly isTouchDevice: boolean;
}

/**
 * Graph information API
 */
export interface GraphAPI {
    /**
     * The name of the current graph
     */
    readonly name: string;

    /**
     * Graph type: "hosted" or "offline"
     */
    readonly type: 'hosted' | 'offline';

    /**
     * Whether the graph is encrypted or not
     */
    readonly isEncrypted: boolean;
}

/**
 * File upload parameters
 */
export interface FileUploadParams {
    file: File;
    toast?: {
        hide?: boolean;
    };
}

/**
 * File API
 */
export interface FileAPI {
    /**
     * Upload a file to Roam
     * @param params - File upload parameters
     * @returns Promise that resolves to a firebase download url
     */
    upload(params: FileUploadParams): Promise<string>;

    /**
     * Fetch a file hosted on Roam
     * @param params - File URL parameters
     * @returns Promise that resolves to a File object
     */
    get(params: { url: string }): Promise<File>;

    /**
     * Delete a file hosted on Roam
     * @param params - File URL parameters
     * @returns Promise that resolves to undefined
     */
    delete(params: { url: string }): Promise<void>;
}

/**
 * User API
 */
export interface UserAPI {
    /**
     * Returns the current user's uid
     * @returns User UID string or null
     */
    uid(): string | null;

    /**
     * Returns whether the current user is an admin (graph owner)
     * @returns Boolean indicating if user is admin
     */
    isAdmin(): boolean;
}

/**
 * Installed extension information
 */
export interface InstalledExtension {
    id: string;
    name: string;
    enabled: boolean;
    version: string; // 'DEV' is for developer loaded extensions
}

/**
 * Depot API
 */
export interface DepotAPI {
    /**
     * Returns a map of the extensions currently installed through Roam Depot or dev mode
     * @returns Object mapping extension IDs to extension information
     */
    getInstalledExtensions(): Record<string, InstalledExtension>;
}

/**
 * Constants API
 */
export interface ConstantsAPI {
    /**
     * The URL for a CORS-anywhere proxy hosted by the Roam team
     * Use by prepending this URL to your target URL: `${corsAnywhereProxyUrl}/${urlToFetch}`
     */
    readonly corsAnywhereProxyUrl: string;
}

/**
 * Roam Alpha API - Main interface
 * Mounted on window.roamAlphaAPI in Roam Research environment
 */
export interface RoamAlphaAPI {
    /**
     * Data operations (queries, pulls, block/page operations)
     */
    data: DataAPI;

    /**
     * UI operations (windows, menus, components, etc.)
     */
    ui: UIAPI;

    /**
     * Utility functions
     */
    util: UtilAPI;

    /**
     * Platform detection
     */
    platform: PlatformAPI;

    /**
     * Graph information
     */
    graph: GraphAPI;

    /**
     * File operations
     */
    file: FileAPI;

    /**
     * User information
     */
    user: UserAPI;

    /**
     * Depot/extensions information
     */
    depot: DepotAPI;

    /**
     * Constants
     */
    constants: ConstantsAPI;

    /**
     * Query the graph using datomic flavored datalog (convenience method)
     * @param query - Datalog query string
     * @param args - Additional query arguments
     * @returns Query results
     * @see data.q for full documentation
     */
    q(query: string, ...args: any[]): QueryResult[];

    /**
     * Pull entity data (convenience method)
     * @param pattern - Pull pattern string
     * @param eid - Entity ID
     * @returns Pulled entity data
     * @see data.pull for full documentation
     */
    pull(pattern: PullPattern, eid: EntityId): PullResult;

    /**
     * Create a new block (convenience method)
     * @param params - Block create parameters
     * @returns Promise which resolves once operation has completed
     * @see data.block.create for full documentation
     */
    createBlock(params: BlockCreateParams): Promise<void>;

    /**
     * Update a block (convenience method)
     * @param params - Block update parameters
     * @returns Promise which resolves once operation has completed
     * @see data.block.update for full documentation
     */
    updateBlock(params: BlockUpdateParams): Promise<void>;

    /**
     * Move a block (convenience method)
     * @param params - Block move parameters
     * @returns Promise which resolves once operation has completed
     * @see data.block.move for full documentation
     */
    moveBlock(params: BlockMoveParams): Promise<void>;

    /**
     * Delete a block (convenience method)
     * @param params - Block delete parameters
     * @returns Promise which resolves once operation has completed
     * @see data.block.delete for full documentation
     */
    deleteBlock(params: BlockDeleteParams): Promise<void>;

    /**
     * Create a new page (convenience method)
     * @param params - Page create parameters
     * @returns Promise which resolves once operation has completed
     * @see data.page.create for full documentation
     */
    createPage(params: PageCreateParams): Promise<void>;

    /**
     * Update a page (convenience method)
     * @param params - Page update parameters
     * @returns Promise which resolves once operation has completed
     * @see data.page.update for full documentation
     */
    updatePage(params: PageUpdateParams): Promise<void>;

    /**
     * Delete a page (convenience method)
     * @param params - Page delete parameters
     * @returns Promise which resolves once operation has completed
     * @see data.page.delete for full documentation
     */
    deletePage(params: PageDeleteParams): Promise<void>;
}

/**
 * Global window extension for Roam Alpha API
 */
declare global {
    interface Window {
        /**
         * Roam Alpha API instance
         * Available in Roam Research environment
         */
        roamAlphaAPI: RoamAlphaAPI;
    }
}

export { };
