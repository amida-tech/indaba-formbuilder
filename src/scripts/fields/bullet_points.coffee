Formbuilder.registerField 'bullet_points',

  order: 30

  view: """
    <input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />
    <div>...</div>
    <input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-list'></span></span> <%= Formbuilder.i18n('BULLET_POINTS') %>
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs
