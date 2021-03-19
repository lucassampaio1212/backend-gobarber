import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeEmailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'template email';
  }
}
export default FakeEmailTemplateProvider;
