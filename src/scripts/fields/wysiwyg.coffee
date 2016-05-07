Formbuilder.registerField 'policy',

  order: 102

  type: 'wysiwyg'

  view: """
    <label class="fb-wysiwyg-label"><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>
    <textarea class="fb-editor" data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' data-placeholder="<%= Formbuilder.i18n('POLICY_PLACEHOLDER') %>"></textarea> 
  """

  edit: """
    <%= Formbuilder.templates['edit/label']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-pencil-square-o'></span></span> <%= Formbuilder.i18n('WYSIWYG') %>
  """

