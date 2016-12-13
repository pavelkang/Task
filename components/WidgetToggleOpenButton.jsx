const WidgetToggleOpenButton = React.createClass({

  render() {
    return(
      <div>
      {
        this.props.isOpen ?
          (<button className="pt-button pt-minimal pt-icon-small-minus" onClick={this.props.toggleopen}></button>)
          :
          (<button className="pt-button pt-minimal pt-icon-maximize" onClick={this.props.toggleopen}></button>)
      }
      </div>
    )
  }
});

module.exports = WidgetToggleOpenButton;
