Formbuilder.registerField 'section_break',

  order: 100

  type: 'non_input'

  view: """
    <hr />
    <label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>
    <span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>
    <hr />
  """

  edit: """
    <div class='fb-edit-section-header'><%= Formbuilder.i18n('LABEL') %></div>
    <input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder="<%= Formbuilder.i18n('Label') %>" />
    <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder="<%= Formbuilder.i18n('ADD_LONGER_DESCRIPTION') %>"></textarea>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-minus'></span></span> <%= Formbuilder.i18n('SECTION_BREAK') %>
  """
