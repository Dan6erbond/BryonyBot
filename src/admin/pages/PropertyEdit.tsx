import _ from "lodash";
import React from "react";
import { Button, Col, Container, Form, Image, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, compose, Dispatch } from "redux";
import Firebase, { withFirebase } from "../../Firebase";
import { Property } from "../../models/property";
import { RootState } from "../../store";
import { setProperties, setProperty } from "../../store/Properties";

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
  setProperties: typeof setProperties;
  setProperty: typeof setProperty;
}

const PropertyEdit = ({
  firebase,
  properties,
  setProperties,
  setProperty,
  match,
}: PropertyEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<Property>();

  const nameInput = watch("name");
  const shopSelection = watch("shop");

  const propertyAlreadyExists = React.useMemo(
    () => !!properties.find((p) => p.name === nameInput),
    [properties, nameInput]
  );

  const [saving, setSaving] = React.useState(false);

  const [propertyExists, setPropertyExists] = React.useState(true);
  const [property, setStateProperty] = React.useState<Property>({
    name: "",
    img: "",
    shop: shops[0],
    url: "",
    locations: [],
  });

  const saveProperty = React.useCallback(
    _.debounce(async (property: Property) => {
      setSaving(true);
      setStateProperty(property);
      setProperty(property);
      setTimeout(() => setSaving(false), 250);
    }, 500),
    []
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
    (data: any) =>
      saveProperty({
        ...property,
        ...data,
      }),
    [saveProperty, property]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      saveProperty({
        ...property,
        [e.target.name]: e.target.value,
      });
    },
    [saveProperty, property]
  );

  if (match.params.id && !propertyExists) {
    return (
      <Container fluid>
        <div>
          <h2>Property not found.</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {property && (
        <div>
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
      )}
    </Container>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setProperties,
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
