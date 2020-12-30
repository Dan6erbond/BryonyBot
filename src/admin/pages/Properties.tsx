import { faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Property } from "../../models/property";
import { RootState } from "../../store";
import { setProperties } from "../../store/Properties";

interface PropertiesProps {
  firebase?: Firebase;
  properties: Property[];
  setProperties: typeof setProperties;
}

function Properties({ firebase, properties, setProperties }: PropertiesProps) {
  React.useEffect(() => {
    if (!properties || properties.length === 0) {
      firebase!.getProperties().then(setProperties);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid className="p-2">
      <div className="admin-header">
        <h1>Properties</h1>
        <div className="d-flex align-items-center mb-3">
          <Button variant="outline-dark" as={Link} to="/admin/updates/edit">
            <FontAwesomeIcon icon={faPlusCircle} /> New property
          </Button>
        </div>
      </div>
      <ListGroup>
        {properties
          .map((property) => (
            <ListGroup.Item
              action
              key={property.docRef!.id}
              as={Link}
              to={"/admin/properties/edit/" + property.docRef?.id}
              className="d-flex justify-content-between align-items-center"
            >
              {property.name}
              <Button variant="link">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </Container>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setProperties,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  properties: state.properties.properties,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Properties) as any;
