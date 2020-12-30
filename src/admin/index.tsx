import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import Vehicles from "../components/Vehicles";
import "./index.scss";
import Missions from "./pages/Missions";
import Properties from "./pages/Properties";
import PropertyEdit from "./pages/PropertyEdit";
import UpdateEdit from "./pages/UpdateEdit";
import Updates from "./pages/Updates";
import VehicleEdit from "./pages/VehicleEdit";

function Admin() {
  React.useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  });

  return (
    <Container fluid className="p-0 h-100 admin">
      <Row className="h-100 align-items-stretch">
        <Col md={3} sm={12} lg={2}>
          <Nav className="flex-md-column admin-nav h-100 p-2">
            <Nav.Link as={Link} to="/admin/vehicles" eventKey="vehicles">
              Vehicles
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/missions" eventKey="missions">
              Missions
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/properties" eventKey="properties">
              Properties
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/updates" eventKey="updates">
              Updates
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={9} sm={12} lg={10} className="h-100">
          <Switch>
            <Route path="/admin" exact>
              <Container fluid>
                <h1>Admin Panel</h1>
              </Container>
            </Route>
            <Route path="/admin/vehicles/edit/:id?" component={VehicleEdit} />
            <Route path="/admin/vehicles">
              <Vehicles admin />
            </Route>
            <Route path="/admin/missions" component={Missions} />
            <Route path="/admin/updates/edit/:id?" component={UpdateEdit} />
            <Route path="/admin/updates" component={Updates} />
            <Route
              path="/admin/properties/edit/:id?"
              component={PropertyEdit}
            />
            <Route path="/admin/properties" component={Properties} />
          </Switch>
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;
