Formbuilder.registerField 'section_start',

  order: 99
  
  type: 'non_input'

  view: """
    <label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>
    <span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>
    <hr />
  """

  edit: """
    <div class='fb-edit-section-header'>Label</div>
    <input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />
    <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-arrow-right'></span></span> Section Start
  """
