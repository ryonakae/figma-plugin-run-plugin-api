export interface IStandaloneEditorConstructionOptions {
  /**
   * The initial value of the auto created model in the editor.
   * To not automatically create a model, use `model: null`.
   */
  value?: string
  /**
   * The initial language of the auto created model in the editor.
   * To not automatically create a model, use `model: null`.
   */
  language?: string
}
