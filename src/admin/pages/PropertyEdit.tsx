import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Modal,
  ModalProps,
  Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Property, PropertyLocation } from "../../models/property";
import { RootState } from "../../store";
import { setProperty } from "../../store/Properties";

const shops = [
  "Dynasty 8 Real Estate",
  "Maze Bank Foreclosures",
  "SecuroServ",
  "The Open Road",
  "Dynasty 8 Executive",
  "Warstock Cache & Carry",
  "DockTease",
  "The Diamond Casion & Resort",
  "ArenaWar.tv",
];

interface PropertyEditMatch {
  id?: string;
}

interface PropertyEditProps extends RouteComponentProps<PropertyEditMatch> {
  firebase?: Firebase;
  properties: Property[];
  setProperty: typeof setProperty;
}

const PropertyEdit = ({
  firebase,
  properties,
  setProperty,
  match,
}: PropertyEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<Property>();
  const [showLocationModal, setShowLocationModal] = React.useState(false);

  const nameInput = watch("name");
  const shopSelection = watch("shop");

  const [saving, setSaving] = React.useState(false);

  const [propertyExists, setPropertyExists] = React.useState(true);
  const [property, setStateProperty] = React.useState<Property>({
    name: "",
    img: "",
    shop: shops[0],
    url: "",
    locations: [],
  });

  const propertyAlreadyExists = React.useMemo(
    () =>
      !!properties.find(
        (p) => p.name === nameInput && p.docRef?.id !== property.docRef?.id
      ),
    [property, properties, nameInput]
  );

  const saveProperty = React.useCallback(
    _.debounce(async () => {
      const { docRef, locations, ...p } = property;
      setSaving(true);
      if (docRef) {
        await docRef.update(p);
        setSaving(false);
        setProperty(property);
      } else {
        const ref = await firebase?.db.collection("properties").add(p);
        const _p = {
          ...property,
          docRef: ref,
        };
        setStateProperty(_p);
        setProperty(_p);
      }
    }, 500),
    [setSaving, property, setStateProperty, setProperty]
  );

  React.useEffect(() => {
    (async () => {
      setPropertyExists(true);
      if (match.params.id) {
        let p: Property | undefined | boolean = properties.find(
          (p) => p.docRef?.id === match.params.id
        );
        if (!p) {
          p = await firebase!.getProperty(match.params.id);
          p && setProperty(p);
        }
        if (p) {
          setStateProperty(p);
          setValue("name", p.name);
          setValue("img", p.img);
          setValue("shop", p.shop);
          setValue("url", p.url);
        } else {
          setPropertyExists(false);
        }
      }
    })();
  }, [
    match,
    setStateProperty,
    setProperty,
    firebase,
    setPropertyExists,
    properties,
    setValue,
  ]);

  const onSubmit = React.useCallback(
    (data: any) => {
      setStateProperty({
        ...property,
        ...data,
      });
      saveProperty();
    },
    [saveProperty, property]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStateProperty({
        ...property,
        [e.target.name]: e.target.value,
      });
      saveProperty();
    },
    [saveProperty, setStateProperty, property]
  );

  const addLocation = React.useCallback(
    async (location: PropertyLocation) => {
      setSaving(true);
      const { docRef, ...l } = location;
      const ref = await property.docRef!.collection("locations").add(l);
      const p = {
        ...property,
        locations: [
          ...property.locations,
          {
            ...location,
            docRef: ref,
          },
        ],
      };
      setProperty(p);
      setStateProperty(p);
      setShowLocationModal(false);
      setSaving(false);
    },
    [setStateProperty, setProperty, property]
  );

  const removeLocation = React.useCallback(
    async (location: PropertyLocation) => {
      setSaving(true);
      await location.docRef!.delete();
      const p = {
        ...property,
        locations: property.locations.filter(
          (l) => l.docRef?.id !== location.docRef?.id
        ),
      };
      setStateProperty(p);
      setProperty(p);
      setSaving(false);
    },
    [setStateProperty, setProperty, property]
  );

  if (match.params.id && !propertyExists) {
    return (
      <Container fluid>
        <div>
          <h2>Property not found.</h2>
        </div>
      </Container>
    );
  } else if (propertyExists && !property) {
    return (
      <Container fluid>
        <div>
          <h1>Loading...</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div>
        <AddLocationModal
          show={showLocationModal}
          addLocation={addLocation}
          handleClose={() => setShowLocationModal(false)}
        />

        <h1>{property.name}</h1>

        <Image
          src={property.img}
          className="my-4"
          thumbnail
          style={{ maxHeight: "200px" }}
        />

        <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>Name *</Form.Label>
              <Form.Control
                placeholder="Name"
                name="name"
                ref={register}
                onChange={onChange}
              />
              {propertyAlreadyExists && (
                <Form.Text className="text-danger">
                  This property name is already in use, make sure the entry
                  doesn't already exist.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Image</Form.Label>
              <Form.Control
                placeholder="Image"
                name="img"
                ref={register}
                onChange={onChange}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>URL</Form.Label>
              <Form.Control
                placeholder="URL"
                name="url"
                ref={register}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Shop</Form.Label>
              <Form.Control
                as="select"
                name="shop"
                ref={register}
                onChange={onChange}
              >
                {shops.map((shop) => (
                  <option
                    key={shop}
                    value={shop}
                    aria-selected={shop === shopSelection}
                  >
                    {shop}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <div className="d-flex w-100 justify-content-between">
                <Form.Label>Locations</Form.Label>
                <Button
                  variant="outline-dark"
                  onClick={() => setShowLocationModal(true)}
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Add location
                </Button>
              </div>
              <ListGroup className="mt-2">
                {property.locations.map((location) => (
                  <ListGroup.Item className="p-0 d-flex" key={location.docRef!.id}>
                    <Image
                      src={location.img}
                      thumbnail
                      style={{ maxHeight: "40px" }}
                    />
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text className="w-100">
                          {location.name}
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <InputGroup.Append>
                        <Button
                          variant="secondary"
                          style={{
                            backgroundColor: "#e9ecef",
                            borderColor: "#ced4da",
                            color: "black",
                          }}
                          onClick={() => removeLocation(location)}
                        >
                          Delete
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Form.Group>
            <Form.Group as={Col}></Form.Group>
          </Form.Row>
          <div className="d-flex flex-row-reverse align-items-center">
            <Button type="submit" className="rockstar-yellow">
              Save
            </Button>
            {saving && (
              <Spinner animation="border" role="status" className="mr-4 mt-2">
                <span className="sr-only">Saving...</span>
              </Spinner>
            )}
            <span className="text-muted mr-auto">
              Fields marked with * are required.
            </span>
          </div>
        </Form>
      </div>
    </Container>
  );
};

interface AddLocationModalProps extends ModalProps {
  addLocation: (location: PropertyLocation) => void;
  handleClose: () => void;
}

const AddLocationModal = ({
  addLocation,
  handleClose,
  ...props
}: AddLocationModalProps) => {
  const { register, handleSubmit } = useForm<PropertyLocation>();

  return (
    <Modal {...props} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Location</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(addLocation)}>
        <Modal.Body>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>Name *</Form.Label>
              <Form.Control placeholder="Name" name="name" ref={register} />
            </Form.Group>
          </Form.Row>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>Image</Form.Label>
              <Form.Control placeholder="Image" name="img" ref={register} />
            </Form.Group>
          </Form.Row>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>URL</Form.Label>
              <Form.Control placeholder="URL" name="url" ref={register} />
            </Form.Group>
          </Form.Row>
          <Form.Row className="mb-2">
            <Form.Group as={Col}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                placeholder="Price"
                name="price"
                type="number"
                ref={register}
              />
            </Form.Group>
          </Form.Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setProperty,
    },
    dispatch
  );

const mapStateToProps = (state: RootState) => ({
  properties: state.properties.properties,
});

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(PropertyEdit) as any;
