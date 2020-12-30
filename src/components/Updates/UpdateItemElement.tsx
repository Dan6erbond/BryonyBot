import { faExternalLinkAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { SaleItem, UpdateItem } from "../../models/update";
import "../../styles/bs-modal.scss";

interface UpdateItemCardProps {
  item: UpdateItem | SaleItem;
}

function UpdateItemElement({ item }: UpdateItemCardProps) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <div onClick={handleShow}>
        {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
        <span>
          {(item as SaleItem).amount
            ? `${item.name} - ${(item as SaleItem).amount}% off`
            : item.name}{" "}
        </span>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {(item as SaleItem).amount ? (
              <span>
                {item.price && (
                  <span>
                    <del>GTA$ {item.price.toLocaleString()}</del> GTA${" "}
                    {(
                      item.price *
                      (1 - (item as SaleItem).amount / 100)
                    ).toLocaleString()}
                  </span>
                )}
                {item.tradePrice && (
                  <span>
                    <br />
                    <del>GTA$ {item.tradePrice.toLocaleString()}</del> GTA${" "}
                    {(
                      item.tradePrice *
                      (1 - (item as SaleItem).amount / 100)
                    ).toLocaleString()}{" "}
                    (Trade Price)
                  </span>
                )}
              </span>
            ) : (
              <span>
                {item.price && "GTA$ " + item.price.toLocaleString()}
                {item.tradePrice &&
                  "\nGTA$ " + item.tradePrice.toLocaleString()}
                {item.minPrice &&
                  item.maxPrice &&
                  "\nGTA$ " +
                    item.minPrice.toLocaleString() +
                    " - GTA$ " +
                    item.maxPrice.toLocaleString()}
              </span>
            )}
            {item.shop && (
              <span className="pt-2 mt-2">
                <br />
                <b>Available at</b> {item.shop}
              </span>
            )}
          </p>
          {item.img && (
            <Image
              src={item.img}
              className="mt-2"
              thumbnail
              style={{ maxHeight: "150px" }}
            />
          )}
          {item.url && (
            <Button variant="link" href={item.url} target="_blank">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Button>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateItemElement;
