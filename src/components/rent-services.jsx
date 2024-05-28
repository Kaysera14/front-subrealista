import { Checkbox, FormControlLabel } from "@mui/material";
import ElevatorOutlinedIcon from "@mui/icons-material/ElevatorOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import TerrainOutlinedIcon from "@mui/icons-material/TerrainOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import SurroundSoundOutlinedIcon from "@mui/icons-material/SurroundSoundOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import BreakfastDiningOutlinedIcon from "@mui/icons-material/BreakfastDiningOutlined";

export const RentServices = ({ setStepData, stepData }) => {
  const handleServiceCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setStepData((prevStepData) => ({
      ...prevStepData,

      [name]: checked,
    }));
  };

  return (
    <section className="flex flex-col w-full items-center justify-evenly px-8">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Selecciona los servicios
      </h2>

      <section className="grid grid-cols-2 gap-2">
        <FormControlLabel
          className="flex flex-row items-center border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.elevator}
              onChange={handleServiceCheckboxChange}
              name="elevator"
              icon={<ElevatorOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Elevator"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.near_beach}
              onChange={handleServiceCheckboxChange}
              name="near_beach"
              icon={<BeachAccessOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Near the Beach"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.near_mountain}
              onChange={handleServiceCheckboxChange}
              name="near_mountain"
              icon={<TerrainOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Near the Mountain"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.hairdryer}
              onChange={handleServiceCheckboxChange}
              name="hairdryer"
              icon={<AirOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Hairdryer"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.washing_machine}
              onChange={handleServiceCheckboxChange}
              name="washing_machine"
              icon={
                <LocalLaundryServiceOutlinedIcon style={{ color: "#002222" }} />
              }
            />
          }
          label="Washing Machine"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.ac}
              onChange={handleServiceCheckboxChange}
              name="ac"
              icon={<AcUnitOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Air Conditioning"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.smoke_detector}
              onChange={handleServiceCheckboxChange}
              name="smoke_detector"
              icon={<SurroundSoundOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Smoke Detector"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.first_kit_aid}
              onChange={handleServiceCheckboxChange}
              name="first_kit_aid"
              icon={
                <MedicalServicesOutlinedIcon style={{ color: "#002222" }} />
              }
            />
          }
          label="First Aid Kit"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.wifi}
              onChange={handleServiceCheckboxChange}
              name="wifi"
              icon={<WifiOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Wifi"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.refrigerator}
              onChange={handleServiceCheckboxChange}
              name="refrigerator"
              icon={<KitchenOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Refrigerator"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.freezer}
              onChange={handleServiceCheckboxChange}
              name="freezer"
              icon={<KitchenOutlinedIcon style={{ color: "#002222" }} />}
            />
          }
          label="Freezer"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.toaster}
              onChange={handleServiceCheckboxChange}
              name="toaster"
              icon={
                <BreakfastDiningOutlinedIcon style={{ color: "#002222" }} />
              }
            />
          }
          label="Toaster"
        />
        <FormControlLabel
          className="border shadow-md rounded-md px-2"
          sx={{ margin: 0 }}
          control={
            <Checkbox
              checked={stepData.fully_equipped}
              onChange={handleServiceCheckboxChange}
              name="fully_equipped"
              icon={
                <BreakfastDiningOutlinedIcon style={{ color: "#002222" }} />
              }
            />
          }
          label="Fully Equipped Kitchen"
        />
      </section>
    </section>
  );
};
