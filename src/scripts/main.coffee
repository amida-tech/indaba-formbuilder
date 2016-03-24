class FormbuilderModel extends Backbone.DeepModel
  sync: -> # noop
  indexInDOM: ->
    $wrapper = $(".fb-field-wrapper").filter ( (_, el) => $(el).data('cid') == @cid  )
    $(".fb-field-wrapper").index $wrapper
  is_input: ->
    Formbuilder.inputFields[@get(Formbuilder.options.mappings.FIELD_TYPE)]?


class FormbuilderCollection extends Backbone.Collection
  initialize: ->
    @on 'add', @copyCidToModel

  model: FormbuilderModel

  comparator: (model) ->
    model.indexInDOM()

  copyCidToModel: (model) ->
    model.attributes.cid = model.cid


class ViewFieldView extends Backbone.View
  className: "fb-field-wrapper"

  events:
    'click .subtemplate-wrapper': 'focusEditView'
    'click .js-duplicate': 'duplicate'
    'click .js-clear': 'clear'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "change", @render
    @listenTo @model, "destroy", @remove

  render: ->
    #TODO: problem on option checked change (1 step back)
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.FIELD_TYPE))
        .data('cid', @model.cid)
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))

    return @

  focusEditView: ->
    @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    cb = =>
      @parentView.handleFormUpdate()
      @model.destroy()

    x = Formbuilder.options.CLEAR_FIELD_CONFIRM

    switch typeof x
      when 'string'
        if confirm(x) then cb()
      when 'function'
        x(cb)
      else
        cb()

  duplicate: ->
    attrs = _.clone(@model.attributes)
    delete attrs['id']
    attrs['label'] += ' Copy'
    @parentView.createField attrs, { position: @model.indexInDOM() + 1 }


class EditFieldView extends Backbone.View
  className: "edit-response-field"

  events:
    'click .js-add-option': 'addOption'
    'click .js-remove-option': 'removeOption'
    'click .js-default-updated': 'defaultUpdated'
    'input .fb-option-label-input': 'forceRender'
    'input .fb-option-value-input': 'forceRender'
    'click .js-add-link': 'addLink'
    'click .js-remove-link': 'removeLink'
    'input .fb-link-label-input': 'forceRender'
    #'input .fb-link-url-input': 'forceRender'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.html(Formbuilder.templates["edit/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    rivets.bind @$el, { model: @model }
    return @

  remove: ->
    @parentView.editView = undefined
    @parentView.$el.find("[data-target=\"#addField\"]").click()
    super

  # @todo this should really be on the model, not the view
  addOption: (e) ->
    $el = $(e.currentTarget)
    i = @$el.find('.fb-edit-option').index($el.closest('.fb-edit-option'))
    options = @model.get(Formbuilder.options.mappings.OPTIONS) || []
    newOption = {label: '', checked: false, value: ''}

    if i > -1
      options.splice(i + 1, 0, newOption)
    else
      options.push newOption

    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  addLink: (e) ->
    $el = $(e.currentTarget)
    i = @$el.find('.fb-edit-link').index($el.closest('.fb-edit-link'))
    links = @model.get(Formbuilder.options.mappings.LINKS) || []
    newLink = {label: '' } #, url: ''}

    if i > -1
      links.splice(i + 1, 0, newLink)
    else
      links.push newLink

    @model.set Formbuilder.options.mappings.LINKS, links
    @model.trigger "change:#{Formbuilder.options.mappings.LINKS}"
    @forceRender()

  removeOption: (e) ->
    $el = $(e.currentTarget)
    index = @$el.find(".js-remove-option").index($el)
    options = @model.get Formbuilder.options.mappings.OPTIONS
    options.splice index, 1
    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  removeLink: (e) ->
    $el = $(e.currentTarget)
    index = @$el.find(".js-remove-link").index($el)
    links = @model.get Formbuilder.options.mappings.LINKS
    links.splice index, 1
    @model.set Formbuilder.options.mappings.LINKS, links
    @model.trigger "change:#{Formbuilder.options.mappings.LINKS}"
    @forceRender()

  defaultUpdated: (e) ->
    $el = $(e.currentTarget)

    unless @model.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' # checkboxes can have multiple options selected
      @$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change')

    @forceRender()

  forceRender: ->
    @model.trigger('change')


class BuilderView extends Backbone.View
  SUBVIEWS: []

  events:
    'click .js-save-form': 'saveForm'
    'click .fb-tabs a': 'showTab'
    'click .fb-add-field-types a': 'addField'
    'mouseover .fb-add-field-types': 'lockLeftWrapper'
    'mouseout .fb-add-field-types': 'unlockLeftWrapper'

  initialize: (options) ->
    {selector, @formBuilder, @bootstrapData} = options

    # This is a terrible idea because it's not scoped to this view.
    if selector?
      @setElement $(selector)

    # Create the collection, and bind the appropriate events
    @collection = new FormbuilderCollection
    @collection.bind 'add', @addOne, @
    @collection.bind 'reset', @reset, @
    @collection.bind 'change', @handleFormUpdate, @
    @collection.bind 'destroy add reset', @hideShowNoResponseFields, @
    @collection.bind 'destroy', @ensureEditViewScrolled, @

    @render()
    @collection.reset(@bootstrapData)
    @bindSaveEvent()

  bindSaveEvent: ->
    @formSaved = true
    @saveFormButton = @$el.find(".js-save-form")
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)

    unless !Formbuilder.options.AUTOSAVE
      setInterval =>
        @saveForm.call(@)
      , 5000

    $(window).bind 'beforeunload', =>
      if @formSaved then undefined else Formbuilder.options.dict.UNSAVED_CHANGES

  reset: ->
    @$responseFields.html('')
    @addAll()

  render: ->
    @$el.html Formbuilder.templates['page']()

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.fb-menu')
    @$responseFields = @$el.find('.fb-response-fields')

    @bindWindowScrollEvent()
    @hideShowNoResponseFields()

    # Render any subviews (this is an easy way of extending the Formbuilder)
    new subview({parentView: @}).render() for subview in @SUBVIEWS

    return @

  bindWindowScrollEvent: ->
    $(window).on 'scroll', =>
      return if @$fbLeft.data('locked') == true
      newMargin = Math.max(0, $(window).scrollTop() - @$el.offset().top)
      maxMargin = @$responseFields.height()

      @$fbLeft.css
        'margin-top': Math.min(maxMargin, newMargin)

  showTab: (e) ->
    $el = $(e.currentTarget)
    target = $el.data('target')
    $el.closest('li').addClass('active').siblings('li').removeClass('active')
    $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active')

    @unlockLeftWrapper() unless target == '#editField'

    if target == '#editField' && !@editView && (first_model = @collection.models[0])
      @createAndShowEditView(first_model)

  addOne: (responseField, _, options) ->
    view = new ViewFieldView
      model: responseField
      parentView: @

    #####
    # Calculates where to place this new field.
    #
    # Are we replacing a temporarily drag placeholder?
    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)

    # Are we adding to the bottom?
    else if !options.position? || options.position == -1
      @$responseFields.append view.render().el

    # Are we adding to the top?
    else if options.position == 0
      @$responseFields.prepend view.render().el

    # Are we adding below an existing field?
    else if ($replacePosition = @$responseFields.find(".fb-field-wrapper").eq(options.position))[0]
      $replacePosition.before view.render().el

    # Catch-all: add to bottom
    else
      @$responseFields.append view.render().el

  setSortable: ->
    @$responseFields.sortable('destroy') if @$responseFields.hasClass('ui-sortable')
    @$responseFields.sortable
      forcePlaceholderSize: true
      placeholder: 'sortable-placeholder'
      stop: (e, ui) =>
        if ui.item.data('field-type')
          rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {$replaceEl: ui.item}
          @createAndShowEditView(rf)

        @handleFormUpdate()
        return true
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.data('field-type')

    @setDraggable()

  setDraggable: ->
    $addFieldButtons = @$el.find("[data-field-type]")

    $addFieldButtons.draggable
      connectToSortable: @$responseFields
      helper: =>
        $helper = $("<div class='response-field-draggable-helper' />")
        $helper.css
          width: @$responseFields.width() # hacky, won't get set without inline style
          height: '80px'

        $helper

  addAll: ->
    @collection.each @addOne, @
    @setSortable()

  hideShowNoResponseFields: ->
    @$el.find(".fb-no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

  addField: (e) ->
    field_type = $(e.currentTarget).data('field-type')
    @createField Formbuilder.helpers.defaultFieldAttrs(field_type)

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == model.cid )
    $responseFieldEl.addClass('editing').siblings('.fb-field-wrapper').removeClass('editing')

    if @editView
      if @editView.model.cid is model.cid
        @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
        @scrollLeftWrapper($responseFieldEl)
        return

      @editView.remove()

    @editView = new EditFieldView
      model: model
      parentView: @

    $newEditEl = @editView.render().$el
    @$el.find(".fb-edit-field-wrapper").html $newEditEl
    @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
    @scrollLeftWrapper($responseFieldEl)
    return @

  ensureEditViewScrolled: ->
    return unless @editView
    @scrollLeftWrapper $(".fb-field-wrapper.editing")

  scrollLeftWrapper: ($responseFieldEl) ->
    @unlockLeftWrapper()
    return unless $responseFieldEl[0]
#    $.scrollWindowTo ((@$el.offset().top + $responseFieldEl.offset().top) - @$responseFields.offset().top), 200, =>
#      @lockLeftWrapper()

  lockLeftWrapper: ->
    @$fbLeft.data('locked', true)

  unlockLeftWrapper: ->
    @$fbLeft.data('locked', false)

  handleFormUpdate: ->
    return if @updatingBatch
    @formSaved = false
    @saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM)

  saveForm: (e) ->
    return if @formSaved
    @formSaved = true
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
    @collection.sort()
    payload = JSON.stringify fields: @collection.toJSON()

    if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
    @formBuilder.trigger 'save', payload

  doAjaxSave: (payload) ->
    $.ajax
      url: Formbuilder.options.HTTP_ENDPOINT
      type: Formbuilder.options.HTTP_METHOD
      data: payload
      contentType: "application/json"
      success: (data) =>
        @updatingBatch = true

        for datum in data
          # set the IDs of new response fields, returned from the server
          @collection.get(datum.cid)?.set({id: datum.id})
          @collection.trigger 'sync'

        @updatingBatch = undefined


class Formbuilder
  @i18n: (key, data) ->
    data = data || {}
    translation = @options.dict[key]
    if translation
      for k in data
        translation = translation.split('{{' + k + '}}').join(data[k])
    else
      translation = key
    return translation

  @helpers:
    defaultFieldAttrs: (field_type) ->
      attrs = {}
      attrs[Formbuilder.options.mappings.LABEL] = Formbuilder.i18n('UNTITLED')
      attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type
      attrs[Formbuilder.options.mappings.REQUIRED] = true
      attrs['field_options'] = {}
      attrs['field_options']['links'] = []
      Formbuilder.fields[field_type].defaultAttributes?(attrs) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')

  @options:
    BUTTON_CLASS: 'fb-button'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    AUTOSAVE: true
    CLEAR_FIELD_CONFIRM: false

    mappings:
      SIZE: 'field_options.size'
      UNITS: 'field_options.units'
      LABEL: 'label'
      FIELD_TYPE: 'field_type'
      REQUIRED: 'required'
      ATTACHMENT: 'attachment'
      ADMIN_ONLY: 'admin_only'
      OPTIONS: 'field_options.options'
      LINKS: 'field_options.links'
      VALUE: 'field_options.value'
      QID: 'field_options.qid'
      DESCRIPTION: 'field_options.description'
      INCLUDE_OTHER: 'field_options.include_other_option'
      INCLUDE_BLANK: 'field_options.include_blank_option'
      INTEGER_ONLY: 'field_options.integer_only'
      MIN: 'field_options.min'
      MAX: 'field_options.max'
      MINLENGTH: 'field_options.minlength'
      MAXLENGTH: 'field_options.maxlength'
      LENGTH_UNITS: 'field_options.min_max_length_units'
      OPTION_NUMBERING: 'field_options.option_numbering'

    dict:
      ALL_CHANGES_SAVED: 'All changes saved'
      SAVE_FORM: 'Save form'
      UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      UNTITLED: 'Untitled'
      DUPLICATE_FIELD: 'Duplicate Field'
      REMOVE_FIELD: 'Remove Field'
      LINKS: 'Links'
      NO_RESPONSE_FIELDS: 'No response fields'
      ADD_NEW_FIELD: 'Add new field'
      EDIT_FIELD: 'Edit field'
      REQUIRED: 'Required'
      ADD_ATTACHMENT: 'Add attachment'
      QUESTION: 'Question'
      LABEL: 'Label'
      INTEGER_ONLY: 'Integer only'
      ONLY_ACCEPT_INTEGERS: 'Only accept integers'
      TITLE: 'Title'
      ADD_LONGER_DESCRIPTION: 'Add a longer description to this field',
      QUESTION_ID: 'Question ID'
      VALUE: 'Value'
      REFERENCES: 'References'
      REFERENCE: 'Reference'
      ADD_LINK: 'Add Link'
      REMOVE_LINK: 'Remove Link'
      MINIMUM_MAXIMUM: 'Minimum / Maximum'
      ABOVE: 'Above'
      BELOW: 'Below'
      LENGTH_LIMIT: 'Length Limit'
      MIN: 'Min'
      MAX: 'Max'
      CHARACTERS: 'characters'
      WORDS: 'words'
      OPTIONS: 'Options'
      OPTIONS_NUMBERING: 'Options numbering'
      NONE: 'None'
      DECIMAL: 'Decimal'
      LOWER_LATIN: 'Lower-latin'
      UPPER_LATIN: 'Upper-latin'
      INCLUDE_BLANK: 'Include blank'
      ADD_OPTION: 'Add Option'
      REMOVE_OPTION: 'Remove Option'
      INCLUDE_OTHER: 'Include "other"'
      SIZE: 'Size'
      SMALL: 'Small'
      MEDIUM: 'Medium'
      LARGE: 'Large'
      UNITS: 'Units'
      OTHER: 'Other'
      BULLET_POINTS: 'Bullet Points'
      CHECKBOXES: 'Checkboxes'
      DATE: 'Date'
      DROPDOWN: 'Dropdown'
      NUMBER: 'Number'
      PARAGRAPH: 'Paragraph'
      MULTIPLE_CHOICE: 'Multiple Choice'
      SCALE: 'Scale'
      SECTION_BREAK: 'Section Break'
      SECTION_END: 'Section End'
      SECTION_START: 'Section Start'
      TEXT: 'Text'
      YES_NO: 'Yes/No'
      YES: 'Yes'
      NO: 'No'

  @fields: {}
  @inputFields: {}
  @nonInputFields: {}

  @registerField: (name, opts) ->
    for x in ['view', 'edit', 'addButton']
      if opts[x]
        opts[x] = _.template(opts[x])

    opts.field_type = name

    Formbuilder.fields[name] = opts

    if opts.type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  constructor: (opts={}) ->
    _.extend @, Backbone.Events
    args = _.extend opts, {formBuilder: @}
    @mainView = new BuilderView args

window.Formbuilder = Formbuilder

if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
