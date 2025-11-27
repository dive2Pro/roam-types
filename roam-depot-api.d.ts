/**
 * Type definitions for Roam Research Depot/Extension API
 * @see https://roamresearch.com/#/app/developer-documentation/page/y31lhjIqU
 */

/**
 * Generic component type (compatible with React and other frameworks)
 */
export type ComponentType<P = any> = (props: P) => any;

/**
 * Generic React node type (compatible with React and other frameworks)
 */
export type ReactNode = any;

/**
 * Roam Extension API - Main interface for Roam extensions
 */
export interface RoamExtensionAPI {
  /**
   * Settings API - scoped to your extension, persisted across devices
   */
  settings: SettingsAPI;

  /**
   * UI API - for adding UI elements like command palette commands
   */
  ui: ExtensionUIAPI;
}

/**
 * Settings API
 * Settings are scoped to your extension, there is no risk of it conflicting with another extension.
 * They are persisted across devices as well.
 */
export interface SettingsAPI {
  /**
   * Get a setting value
   * @param key - Setting key
   * @returns Setting value or undefined
   */
  get(key: string): any;

  /**
   * Set a setting value
   * @param key - Setting key
   * @param value - Setting value
   */
  set(key: string, value: any): void;

  /**
   * Get all settings
   * @returns Object containing all settings
   */
  getAll(): Record<string, any>;

  /**
   * Settings panel API
   */
  panel: {
    /**
     * Create a settings panel
     * @param config - Settings panel configuration
     * @see https://github.com/panterarocks49/settings-panel-example/blob/main/extension.js for example config
     * @note Regarding "id" in a setting: they must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
     */
    create(config: SettingsPanelConfig): void;
  };
}

/**
 * Settings Panel Configuration
 */
export interface SettingsPanelConfig {
  tabTitle: string;
  settings: SettingConfig[];
}

/**
 * Setting Configuration
 */
export interface SettingConfig {
  /**
   * Setting ID - must be a non-empty string and cannot contain ".", "#", "$", "[", or "]"
   */
  id: string;
  /**
   * CSS class name for the setting
   */
  className?: string;
  name: string;
  /**
   * Setting description - can be a string or React element
   */
  description?: string | ReactNode;
  /**
   * Setting action configuration
   */
  action: SettingAction;
}

/**
 * Setting Action - union type for different action types
 */
export type SettingAction =
  | ButtonSettingAction
  | SwitchSettingAction
  | InputSettingAction
  | SelectSettingAction
  | ReactComponentSettingAction
  | TextSettingAction
  | TextareaSettingAction
  | NumberSettingAction;

/**
 * Button setting action
 */
export interface ButtonSettingAction {
  type: 'button';
  onClick: (evt: any) => void;
  content: string;
}

/**
 * Switch setting action
 */
export interface SwitchSettingAction {
  type: 'switch';
  onChange?: (evt: any) => void;
}

/**
 * Input setting action
 */
export interface InputSettingAction {
  type: 'input';
  placeholder?: string;
  onChange?: (evt: any) => void;
}

/**
 * Select setting action
 */
export interface SelectSettingAction {
  type: 'select';
  items: string[];
  onChange?: (evt: any) => void;
}

/**
 * React component setting action
 */
export interface ReactComponentSettingAction {
  type: 'reactComponent';
  component: ComponentType<any>;
}

/**
 * Text setting action
 */
export interface TextSettingAction {
  type: 'text';
  placeholder?: string;
  onChange?: (evt: any) => void;
}

/**
 * Textarea setting action
 */
export interface TextareaSettingAction {
  type: 'textarea';
  placeholder?: string;
  onChange?: (evt: any) => void;
}

/**
 * Number setting action
 */
export interface NumberSettingAction {
  type: 'number';
  placeholder?: string;
  onChange?: (evt: any) => void;
}

/**
 * Extension UI API
 */
export interface ExtensionUIAPI {
  /**
   * Command palette API
   * Commands added via extensionAPI are associated with your extension and have convenient grouping
   * (e.g., in the Hotkeys window). Unlike roamAlphaAPI's version, you do not need to call removeCommand
   * on onunload - commands are automatically cleaned up on unload.
   */
  commandPalette: ExtensionCommandPaletteAPI;
}

/**
 * Extension Command Palette API
 * Same as window.roamAlphaAPI.ui.commandPalette, but commands are associated with your extension.
 */
export interface ExtensionCommandPaletteAPI {
  /**
   * Adds a command to the Command Palette
   * Same as window.roamAlphaAPI.ui.commandPalette.addCommand, but commands are associated with your extension.
   * @param params - Command parameters
   * @returns Promise which resolves once operation has completed
   */
  addCommand(params: ExtensionCommandPaletteCommandParams): Promise<void>;

  /**
   * Removes a command from the Command Palette
   * Same as window.roamAlphaAPI.ui.commandPalette.removeCommand, but you do not need to call this on onunload.
   * Commands are automatically cleaned up on unload.
   * @param params - Command label
   * @returns Promise which resolves once operation has completed
   */
  removeCommand(params: { label: string }): Promise<void>;
}

/**
 * Extension Command Palette Command Parameters
 * Same as CommandPaletteCommandParams from roamAlphaAPI
 */
export interface ExtensionCommandPaletteCommandParams {
  label: string;
  callback: () => void;
  'disable-hotkey'?: boolean;
  'default-hotkey'?: string | string[]; // String or array of strings for multi-step hotkeys
}

/**
 * UI API (deprecated - use ExtensionUIAPI)
 * @deprecated This interface is kept for backward compatibility
 */
export interface UIAPI {
  /**
   * Create a button in the block context menu
   * @param config - Button configuration
   */
  blockContextMenuButton(config: BlockContextMenuButtonConfig): void;

  /**
   * Create a button in the page context menu
   * @param config - Button configuration
   */
  pageContextMenuButton(config: PageContextMenuButtonConfig): void;

  /**
   * Create a command palette command
   * @param config - Command configuration
   */
  commandPalette(config: CommandPaletteConfig): void;

  /**
   * Create a sidebar panel
   * @param config - Sidebar panel configuration
   */
  sidebarPanel(config: SidebarPanelConfig): SidebarPanel;

  /**
   * Create a floating window
   * @param config - Floating window configuration
   */
  floatingWindow(config: FloatingWindowConfig): FloatingWindow;
}

/**
 * Block Context Menu Button Configuration
 */
export interface BlockContextMenuButtonConfig {
  label: string;
  icon?: string;
  action: (context: BlockContext) => void;
}

/**
 * Page Context Menu Button Configuration
 */
export interface PageContextMenuButtonConfig {
  label: string;
  icon?: string;
  action: (context: PageContext) => void;
}

/**
 * Command Palette Configuration
 */
export interface CommandPaletteConfig {
  label: string;
  callback: (context: CommandContext) => void;
}

/**
 * Sidebar Panel Configuration
 */
export interface SidebarPanelConfig {
  tabTitle: string;
  icon?: string;
  component: ComponentType<any>;
  getProps?: () => any;
}

/**
 * Sidebar Panel Instance
 */
export interface SidebarPanel {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
}

/**
 * Floating Window Configuration
 */
export interface FloatingWindowConfig {
  title: string;
  content: ReactNode;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
}

/**
 * Floating Window Instance
 */
export interface FloatingWindow {
  open(): void;
  close(): void;
  updateContent(content: ReactNode): void;
}

/**
 * Command API
 */
export interface CommandAPI {
  /**
   * Register a command
   * @param config - Command configuration
   */
  register(config: CommandConfig): void;

  /**
   * Unregister a command
   * @param id - Command ID
   */
  unregister(id: string): void;
}

/**
 * Command Configuration
 */
export interface CommandConfig {
  id: string;
  label: string;
  callback: (context: CommandContext) => void;
  shortcut?: string;
}

/**
 * Block API
 */
export interface BlockAPI {
  /**
   * Get block by UID
   * @param uid - Block UID
   * @returns Block data
   */
  get(uid: string): Promise<Block>;

  /**
   * Create a new block
   * @param config - Block creation configuration
   * @returns Created block UID
   */
  create(config: BlockCreateConfig): Promise<string>;

  /**
   * Update a block
   * @param uid - Block UID
   * @param updates - Block updates
   */
  update(uid: string, updates: BlockUpdate): Promise<void>;

  /**
   * Delete a block
   * @param uid - Block UID
   */
  delete(uid: string): Promise<void>;

  /**
   * Move a block
   * @param uid - Block UID
   * @param config - Move configuration
   */
  move(uid: string, config: BlockMoveConfig): Promise<void>;
}

/**
 * Block Create Configuration
 */
export interface BlockCreateConfig {
  string: string;
  location: {
    'parent-uid'?: string;
    order?: number;
  };
  'page-uid'?: string;
  heading?: number;
}

/**
 * Block Update
 */
export interface BlockUpdate {
  string?: string;
  heading?: number;
  'text-align'?: 'left' | 'center' | 'right' | 'justify';
  'children-view-type'?: 'bullet' | 'document' | 'numbered';
  'open'?: boolean;
}

/**
 * Block Move Configuration
 */
export interface BlockMoveConfig {
  'parent-uid'?: string;
  order?: number;
}

/**
 * Page API
 */
export interface PageAPI {
  /**
   * Get page by UID
   * @param uid - Page UID
   * @returns Page data
   */
  get(uid: string): Promise<Page>;

  /**
   * Get page by title
   * @param title - Page title
   * @returns Page data or null
   */
  getByTitle(title: string): Promise<Page | null>;

  /**
   * Create a new page
   * @param title - Page title
   * @returns Created page UID
   */
  create(title: string): Promise<string>;

  /**
   * Update a page
   * @param uid - Page UID
   * @param updates - Page updates
   */
  update(uid: string, updates: PageUpdate): Promise<void>;

  /**
   * Delete a page
   * @param uid - Page UID
   */
  delete(uid: string): Promise<void>;
}

/**
 * Page Update
 */
export interface PageUpdate {
  title?: string;
}

/**
 * Graph API
 */
export interface GraphAPI {
  /**
   * Get current graph UID
   * @returns Graph UID
   */
  getCurrentGraphUid(): string;

  /**
   * Query the graph using Datalog
   * @param query - Datalog query
   * @returns Query results
   */
  q(query: string): Promise<any[]>;

  /**
   * Pull data from the graph
   * @param pattern - Pull pattern
   * @returns Pulled data
   */
  pull(pattern: string): Promise<any>;
}

/**
 * User API
 */
export interface UserAPI {
  /**
   * Get current user information
   * @returns User information
   */
  getCurrentUser(): Promise<User>;

  /**
   * Get user email
   * @returns User email
   */
  getEmail(): Promise<string>;
}

/**
 * Util API
 */
export interface UtilAPI {
  /**
   * Format date
   * @param date - Date to format
   * @param format - Format string
   * @returns Formatted date string
   */
  formatDate(date: Date, format?: string): string;

  /**
   * Parse date from Roam format
   * @param dateString - Date string
   * @returns Parsed date
   */
  parseDate(dateString: string): Date;

  /**
   * Generate a UID
   * @returns Generated UID
   */
  generateUID(): string;

  /**
   * Show toast notification
   * @param message - Toast message
   * @param type - Toast type
   */
  toast(message: string, type?: 'success' | 'error' | 'info' | 'warning'): void;
}

/**
 * Block Context
 */
export interface BlockContext {
  'block-uid': string;
  'block-string': string;
  'page-uid'?: string;
  'parent-uid'?: string;
}

/**
 * Page Context
 */
export interface PageContext {
  'page-uid': string;
  'page-title': string;
}

/**
 * Command Context
 */
export interface CommandContext {
  [key: string]: any;
}

/**
 * Block structure
 */
export interface Block {
  uid: string;
  string: string;
  'page-uid'?: string;
  'parent-uid'?: string;
  order: number;
  'heading'?: number;
  'text-align'?: 'left' | 'center' | 'right' | 'justify';
  'children-view-type'?: 'bullet' | 'document' | 'numbered';
  'open'?: boolean;
  'time'?: number;
  'edit-time'?: number;
  'create-email'?: string;
  'edit-email'?: string;
  children?: Block[];
}

/**
 * Page structure
 */
export interface Page {
  uid: string;
  title: string;
  'create-time'?: number;
  'edit-time'?: number;
  'create-email'?: string;
  'edit-email'?: string;
}

/**
 * User structure
 */
export interface User {
  'user-uid': string;
  'display-name': string;
  'email': string;
}

/**
 * Extension manifest
 */
export interface ExtensionManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  icon?: string;
  'roam-js-version'?: string;
}

/**
 * Extension entry point function
 * @param extensionAPI - Roam Extension API instance
 */
export type ExtensionEntryPoint = (extensionAPI: RoamExtensionAPI) => void | Promise<void>;

/**
 * Global window extension for Roam Extension API
 */

export { };

