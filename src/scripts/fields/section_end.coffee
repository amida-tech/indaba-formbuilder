Formbuilder.registerField 'section_end',

  order: 101


  type: 'non_input'

  view: """
    <hr />
  """

  edit: """
    <hr />
  """

  addButton: """
    <span class='symbol'><span class='fa fa-arrow-left'></span></span> <%= Formbuilder.i18n('SECTION_END') %>
  """
