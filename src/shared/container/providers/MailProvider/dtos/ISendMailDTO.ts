import IParseMailTemplateDTO from "../../MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface ImailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: ImailContact;
  from?: ImailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
