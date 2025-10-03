import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import { languageChoices } from '../utils/languageChoices';

const I18nTextCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>key 必填</p>
            <TextInput source="key" />
            <p>lang 必填</p>
            <SelectInput source="lang" choices={languageChoices} />
            <p>text 必填</p>
            <TextInput source="text" />
        </SimpleForm>
    </Create>
);

export default I18nTextCreate;