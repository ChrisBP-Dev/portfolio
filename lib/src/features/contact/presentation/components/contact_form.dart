import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/contact/presentation/components/country_picker.dart';
import 'package:portfolio/src/features/contact/presentation/components/send_through_dropdown_button.dart';
import 'package:portfolio/src/features/contact/presentation/contact_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactForm extends ConsumerWidget {
  const ContactForm({super.key});

  static final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final contactMessage = ref.watch(contactControllerProvider);

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      maxContentWidth: Breakpoint.tablet,
      child: DecoratedBox(
        decoration: BoxDecoration(
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
                CustomTextFormField(
                  formType: FormType.name,
                  onSaved: (value) {
                    ref
                        .read(contactControllerProvider.notifier)
                        .updateName(value!);
                  },
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.emailLabel)),
                CustomTextFormField(
                  formType: FormType.email,
                  onSaved: (value) {
                    ref
                        .read(contactControllerProvider.notifier)
                        .updateEmail(value!);
                  },
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.phoneNumberLabel)),
                Row(
                  children: [
                    const Expanded(
                      child: CountryPicker(),
                    ),
                    gapW20,
                    Expanded(
                      flex: 2,
                      child: CustomTextFormField(
                        formType: FormType.phoneNumber,
                        onSaved: (value) {
                          ref
                              .read(contactControllerProvider.notifier)
                              .updatePhoneNumber(
                                contactMessage.phoneNumber.countryCode,
                                value!,
                              );
                        },
                      ),
                    ),
                  ],
                ),
                gapH14,
                TitleFormField(title: l10n.whatsYour(l10n.messageLabel)),
                CustomTextFormField(
                  formType: FormType.message,
                  onSaved: (value) {
                    ref
                        .read(contactControllerProvider.notifier)
                        .updateMessage(value!);
                  },
                  maxLines: 6,
                ),
                gapH14,
                TitleFormField(title: l10n.chooseHowToContact),
                SendThroughDropDownButton(
                  value: contactMessage.sendThrough,
                  onChanged: (value) {
                    ref
                        .read(contactControllerProvider.notifier)
                        .updateSendThrough(value!);
                  },
                ),
                gapH39,
                Center(
                  child: PrimaryButton(
                    text: l10n.sendMessage,
                    onTap: () {
                      if (!_formKey.currentState!.validate()) return;
                      _formKey.currentState!.save();
                      ref
                          .read(contactControllerProvider.notifier)
                          .sendContactMessage();
                    },
                  ),
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
