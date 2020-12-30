import { createSelector } from "reselect";
import { RootState } from ".";
import { UpdateItem } from "../models/update";

/**
 * Vehicle selectors
 */

const getVehicles = (state: RootState) => state.vehicles.vehicles;

export const getUpdateVehicles = createSelector([getVehicles], (vehicles) =>
  vehicles.map((v) => {
    const { docRef, manufacturer, ...vehicle } = v;

    return {
      ...vehicle,
      name: manufacturer ? `${manufacturer} ${v.name}` : v.name,
      item: docRef,
    };
  })
);

export const getVehiclesAsSearchInputOptions = createSelector(
  [getUpdateVehicles],
  (vehicles) =>
    vehicles.map((v) => ({
      label: v.name,
      value: v,
      id: v.item!.id,
    }))
);

/**
 * Property selectors
 */

const getProperties = (state: RootState) => state.properties.properties;

export const getUpdateProperties = createSelector(
  [getProperties],
  (properties) => {
    const updateProperties: UpdateItem[] = [];

    for (let property of properties) {
      const { name, docRef, shop, img, url } = property;

      const minPrice = Math.min(...property.locations.map((l) => l.price));
      const maxPrice = Math.max(...property.locations.map((l) => l.price));

      updateProperties.push({
        name,
        minPrice,
        maxPrice,
        item: docRef!,
        shop,
        img,
        url,
      });

      updateProperties.push(
        ...property.locations.map((location) => ({
          name: location.name + " " + property.name,
          price: location.price,
          item: location.docRef!,
          shop: property.shop,
          img: location.img || property.img,
          url: location.url || property.url,
        }))
      );
    }

    return updateProperties;
  }
);

export const getPropertiesAsSearchInputOptions = createSelector(
  [getUpdateProperties],
  (properties) =>
    properties.map((p) => ({
      label: p.name,
      value: p,
      id: p.item!.id,
    }))
);

/**
 * Mission selectors
 */

const getMissions = (state: RootState) => state.missions.missions;

export const getUpdateMissions = createSelector([getMissions], (missions) =>
  missions.map((m) => {
    const { docRef, ...mission } = m;

    return {
      ...mission,
      moneyAmount: 2,
      rpAmount: 2,
      activity: docRef,
    };
  })
);

export const getMissionsAsSearchInputOptions = createSelector(
  [getUpdateMissions],
  (missions) =>
    missions.map((m) => ({
      label: m.name,
      value: m,
      id: m.activity!.id,
    }))
);
