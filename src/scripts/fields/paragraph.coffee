Formbuilder.registerField 'paragraph',

  order: 20

  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'>&#182;</span> <%= Formbuilder.i18n('PARAGRAPH') %>
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs
