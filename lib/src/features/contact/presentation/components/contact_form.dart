import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/common_widgets/primary_button.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/common_widgets/title_form_field.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/constants/breakpoints.dart';
import 'package:portfolio/src/features/contact/data/contact_repository.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/contact/presentation/components/send_through_dropdown_button.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactForm extends ConsumerStatefulWidget {
  const ContactForm({super.key});

  @override
  ConsumerState<ContactForm> createState() => _ContactFormState();
}

class _ContactFormState extends ConsumerState<ContactForm> {
  final _formKey = GlobalKey<FormState>();
  late ContactMessage _contactMessage;
  String _selectedCountryCode = '+1';

  @override
  void initState() {
    super.initState();
    _contactMessage = const ContactMessage(
      name: '',
      email: '',
      phoneNumber: ContactPhoneNumber(countryCode: '', number: ''),
      message: '',
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = context.l10n;

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      maxContentWidth: Breakpoint.tablet,
      child: Container(
        padding: const EdgeInsets.all(Sizes.globalPadding),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(Sizes.p8),
          border: Border.all(color: theme.dividerColor),
        ),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              TitleFormField(title: l10n.whatsYourName),
              CustomTextFormField(
                labelText: 'Name',
                onSaved: (value) {
                  _contactMessage = _contactMessage.copyWith(name: value);
                },
                validator: (value) {
                  if (value!.isNotEmpty) return null;
                  return 'Please enter your name';
                },
              ),
              gapH14,
              TitleFormField(title: l10n.whatsYourEmail),
              CustomTextFormField(
                labelText: 'Email',
                keyboardType: TextInputType.emailAddress,
                onSaved: (value) {
                  _contactMessage = _contactMessage.copyWith(email: value);
                },
                validator: (value) {
                  if (value!.isNotEmpty) return null;
                  return 'Please enter your email';
                },
              ),
              gapH14,
              TitleFormField(title: l10n.whatsYourPhone),
              Row(
                children: [
                  Expanded(
                    child: Theme(
                      data: theme.copyWith(
                        textButtonTheme: TextButtonThemeData(
                          style: ButtonStyle(
                            shape: WidgetStateProperty.all(
                              RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            side: WidgetStateProperty.all(
                              BorderSide(
                                color: theme.dividerColor,
                              ),
                            ),
                          ),
                        ),
                      ),
                      child: CountryCodePicker(
                        dialogSize: const Size(
                          Breakpoint.mobile / 2,
                          Breakpoint.mobile * .85,
                        ),
                        onChanged: (countryCode) {
                          setState(() {
                            _selectedCountryCode = countryCode.dialCode ?? '+1';
                            _contactMessage = _contactMessage.copyWith(
                              phoneNumber: ContactPhoneNumber(
                                countryCode: _selectedCountryCode,
                                number: _contactMessage.phoneNumber.number,
                              ),
                            );
                          });
                        },
                        initialSelection: 'US',
                        favorite: const ['+1', 'US'],
                        textStyle: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface,
                        ),
                        searchDecoration: InputDecoration(
                          hintText: 'Search country',
                          hintStyle: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.hintColor,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        dialogBackgroundColor: theme.scaffoldBackgroundColor,
                        dialogTextStyle: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface,
                        ),
                        barrierColor: Colors.black.withOpacity(0.5),
                        boxDecoration: BoxDecoration(
                          color: theme.scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        showFlagDialog: true,
                        showFlagMain: true,
                        closeIcon: Icon(
                          Icons.close,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ),
                  gapW20,
                  Expanded(
                    flex: 2,
                    child: CustomTextFormField(
                      labelText: 'Phone Number',
                      onSaved: (value) {
                        _contactMessage = _contactMessage.copyWith(
                          phoneNumber: _contactMessage.phoneNumber
                              .copyWith(number: value),
                        );
                      },
                      validator: (value) {
                        if (value!.isNotEmpty) return null;
                        return 'Please enter your phone number';
                      },
                      keyboardType: TextInputType.phone,
                    ),
                  ),
                ],
              ),
              gapH14,
              TitleFormField(title: l10n.whatsYourMessage),
              CustomTextFormField(
                labelText: 'Message',
                onSaved: (value) {
                  _contactMessage = _contactMessage.copyWith(message: value);
                },
                validator: (value) {
                  if (value!.isNotEmpty) return null;
                  return 'Please enter your message';
                },
                maxLines: 6,
              ),
              gapH14,
              SendThroughDropDownButton(
                value: _contactMessage.sendThrough,
                onChanged: (value) {
                  setState(() {
                    _contactMessage = _contactMessage.copyWith(sendVia: value);
                  });
                },
              ),
              gapH39,
              Center(
                child: PrimaryButton(
                  onTap: () {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();
                      // Handle form submission

                      ref
                          .read(contactRepositoryProvider.notifier)
                          .sendContactMessage(_contactMessage);
                    }
                  },
                  text: l10n.sendMessage,
                ),
              ),
              gapH39,
            ],
          ),
        ),
      ),
    );
  }
}
