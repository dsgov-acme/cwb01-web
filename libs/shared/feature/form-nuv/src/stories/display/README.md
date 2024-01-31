# Form Display

![Form builder display panel](assets/builder/text-input-builder-display.png)

## Form builder display guidelines

### Property key name

Each form field that allows a user input will have a property key name, this property key name must coincide with the property name defined in the schema definition.

To set a first name field property key name to coincide with the schema definition below the property key name will be set to `personalInformation.firstName`

Example schema definition:

```json
{
    "id": "1f1494a8-09a4-4d6f-95a0-9fd5bdebf912",
    "key": "FinancialBenefit",
    "name": "FinancialBenefit",
    "attributes": [
        {
            "name": "personalInformation",
            "type": "DynamicEntity",
            "entitySchema": "CommonPersonalInformation",
            "constraints": [],
            "attributeConfigurations": []
        }
    ]
},
{
    "id": "30cf63d1-7b28-4f4f-be0d-6073b6387c90",
    "key": "CommonPersonalInformation",
    "name": "Common personal information",
    "attributes": [
        {
            "name": "firstName",
            "type": "String",
            "constraints": [],
            "attributeConfigurations": []
        }
    ]
}
```
