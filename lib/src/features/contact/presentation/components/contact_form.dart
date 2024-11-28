import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/contact/domain/contact_phone_number.dart';
import 'package:portfolio/src/features/contact/presentation/components/country_picker.dart';
import 'package:portfolio/src/features/contact/presentation/components/send_through_dropdown_button.dart';
import 'package:portfolio/src/features/contact/presentation/contact_controller.dart';
import 'package:portfolio/src/features/contact/presentation/widgets/contact_textform_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactForm extends StatefulWidget {
  const ContactForm({super.key});

  @override
  State<ContactForm> createState() => _ContactFormState();
}

class _ContactFormState extends State<ContactForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController nameController;
  late final TextEditingController emailController;
  late final TextEditingController phoneNumberController;
  late final TextEditingController messageController;
  String countryCode = '+1';
  SendThrough sendThrough = SendThrough.email;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController();
    emailController = TextEditingController();
    phoneNumberController = TextEditingController();
    messageController = TextEditingController();
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneNumberController.dispose();
    messageController.dispose();
    super.dispose();
  }

  String get name => nameController.text;
  String get email => emailController.text;
  String get phoneNumber => phoneNumberController.text;
  String get message => messageController.text;

  ContactMessage get contactMessage => ContactMessage(
        name: name,
        email: email,
        phoneNumber: ContactPhoneNumber(
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        ),
        message: message,
        sendThrough: sendThrough,
      );

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      maxContentWidth: Breakpoint.tablet,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: context.theme.canvasColor,
          borderRadius: BorderRadius.circular(Sizes.p8),
          border: Border.all(color: context.getPrimaryColor()),
        ),
        child: Padding(
          padding: const EdgeInsets.all(Sizes.globalPadding),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                TitleFormField(title: l10n.whatsYour(l10n.nameLabel)),
                ContactTextformField(
                  formType: ContactFormType.name,
                  controller: nameController,
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.emailLabel)),
                ContactTextformField(
                  formType: ContactFormType.email,
                  controller: emailController,
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.phoneNumberLabel)),
                Row(
                  children: [
                    Expanded(
                      child: CountryPicker(
                        onChanged: (countryCode) {
                          setState(() => this.countryCode = countryCode);
                        },
                      ),
                    ),
                    gapW20,
                    Expanded(
                      flex: 2,
                      child: ContactTextformField(
                        formType: ContactFormType.phoneNumber,
                        controller: phoneNumberController,
                      ),
                    ),
                  ],
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.messageLabel)),
                ContactTextformField(
                  formType: ContactFormType.message,
                  controller: messageController,
                  maxLines: 6,
                ),
                gapH14,
                TitleFormField(title: l10n.chooseHowToContact),
                SendThroughDropDownButton(
                  value: sendThrough,
                  onChanged: (sendThrough) {
                    setState(() => this.sendThrough = sendThrough);
                  },
                ),
                gapH39,
                Consumer(
                  builder: (context, ref, child) {
                    return Center(
                      child: PrimaryButton(
                        title: l10n.sendMessage,
                        onTap: () {
                          if (!_formKey.currentState!.validate()) return;
                          ref
                              .read(contactControllerProvider.notifier)
                              .sendContactMessage(contactMessage);
                        },
                      ),
                    );
                  },
                ),
                gapH39,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
