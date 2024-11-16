// import 'package:flutter/foundation.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
// import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
// import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
// import 'package:portfolio/src/core/constants/app_sizes.dart';
// import 'package:portfolio/src/core/utils/theme/color_app.dart';
// import 'package:portfolio/src/core/utils/unit8list_extension.dart';
// import 'package:portfolio/src/features/projects/domain/project.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/create_project/admin_create_project_controller.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/create_project_button.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/features_project_list.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/create_project/widgets/images_list_project.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/widgets/main_image_project_picker.dart';
// import 'package:portfolio/src/features/projects/presentation/admin/widgets/project_form_field.dart';
// import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
// import 'package:portfolio/src/localization/l10n.dart';

// class AdminCreateProjectPage extends ConsumerStatefulWidget {
//   const AdminCreateProjectPage({super.key});

//   @override
//   ConsumerState<AdminCreateProjectPage> createState() =>
//       _AdminCreateProjectPageState();
// }

// class _AdminCreateProjectPageState
//     extends ConsumerState<AdminCreateProjectPage> {
//   final _formKey = GlobalKey<FormState>();

//   String companyNameEN = '';
//   String companyNameES = '';
//   String shortDescriptionEN = '';
//   String shortDescriptionES = '';
//   String websiteUrl = '';
//   String sourceUrl = '';

//   String? _mainImage;
//   final List<Uint8List> _screenshots = [Uint8List.fromList([])];

//   List<String> _featuresEN = [];
//   List<String> _featuresES = [];
//   final List<String> _technologies = [];

//   void _onFeaturesENChanged(List<String> features) {
//     setState(() {
//       _featuresEN = features;
//     });
//   }

//   void _onFeaturesESChanged(List<String> features) {
//     setState(() {
//       _featuresES = features;
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     final l10n = context.l10n;
//     return AlertDialog(
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
//       title: Text(l10n.create(l10n.project)),
//       scrollable: true,
//       actionsAlignment: MainAxisAlignment.center,
//       actionsOverflowButtonSpacing: 15,
//       content: ResponsiveCenter(
//         child: Form(
//           key: _formKey,
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               TitleFormField(title: l10n.mainImageTitle),
//               gapH14,
//               MainImageProjectPicker(
//                 newImage: (newImage) => _mainImage = newImage,
//               ),
//               gapH14,
//               TitleFormField(title: '${l10n.companyName} (EN)'),
//               ProjectFormField(
//                 formType: ProjectFormType.companyName,
//                 onChanged: (newValue) => companyNameEN = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: '${l10n.companyName} (ES)'),
//               ProjectFormField(
//                 formType: ProjectFormType.companyName,
//                 onChanged: (newValue) => companyNameES = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: '${l10n.shortDescription} (EN)'),
//               ProjectFormField(
//                 formType: ProjectFormType.shortDescription,
//                 maxLines: 3,
//                 onChanged: (newValue) => shortDescriptionEN = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: '${l10n.shortDescription} (ES)'),
//               ProjectFormField(
//                 formType: ProjectFormType.shortDescription,
//                 maxLines: 3,
//                 onChanged: (newValue) => shortDescriptionES = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: l10n.technologiesTitle),
//               DecoratedBox(
//                 decoration: BoxDecoration(
//                   border: Border.all(
//                     color: context.getPrimaryColor(),
//                     width: 2,
//                   ),
//                   borderRadius: BorderRadius.circular(Sizes.p4),
//                 ),
//                 child: SizedBox(
//                   width: double.infinity,
//                   child: Padding(
//                     padding: const EdgeInsets.symmetric(
//                       vertical: Sizes.globalPadding,
//                     ),
//                     child: AsyncValueWidget(
//                       value: ref.watch(getAdminTechnologiesProvider),
//                       data: (technologies) {
//                         return Wrap(
//                           children: technologies.map(
//                             (technology) {
//                               return Container(
//                                 width: 240,
//                                 decoration: BoxDecoration(
//                                   borderRadius: BorderRadius.circular(Sizes.p4),
//                                   border: Border.all(
//                                     color: context.getPrimaryColor(),
//                                   ),
//                                 ),
//                                 margin: const EdgeInsets.all(Sizes.p8),
//                                 child: CheckboxListTile.adaptive(
//                                   contentPadding: const EdgeInsets.only(
//                                     left: Sizes.p8,
//                                   ),
//                                   value: _technologies.contains(technology.id),
//                                   onChanged: (isSelected) {
//                                     if (isSelected ?? true) {
//                                       _technologies.add(technology.id);
//                                     } else {
//                                       _technologies.remove(technology.id);
//                                     }
//                                     setState(() {});
//                                   },
//                                   selected:
//                                       _technologies.contains(technology.name),
//                                   title: Text(technology.name),
//                                 ),
//                               );
//                             },
//                           ).toList(),
//                         );
//                       },
//                     ),
//                   ),
//                 ),
//               ),
//               gapH14,
//               FeaturesProjectList(
//                 localeCode: 'EN',
//                 onFeaturesChanged: _onFeaturesENChanged,
//               ),
//               const Divider(),
//               gapH14,
//               FeaturesProjectList(
//                 localeCode: 'ES',
//                 onFeaturesChanged: _onFeaturesESChanged,
//               ),
//               gapH14,
//               const Divider(),
//               TitleFormField(title: l10n.websiteTitle),
//               ProjectFormField(
//                 formType: ProjectFormType.websiteUrl,
//                 onChanged: (newValue) => websiteUrl = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: l10n.sourceCodeTitle),
//               ProjectFormField(
//                 formType: ProjectFormType.sourceCodeUrl,
//                 onChanged: (newValue) => sourceUrl = newValue,
//               ),
//               gapH14,
//               TitleFormField(title: l10n.screenshotsTitle),
//               ImagesListProject(
//                 screenshots: _screenshots,
//                 onImageAdded: (image, index) {
//                   _screenshots
//                     ..removeAt(index)
//                     ..add(image);
//                   final isLast = index == _screenshots.length - 1;
//                   if (isLast) {
//                     _screenshots.add(Uint8List.fromList([]));
//                   }
//                   setState(() {});
//                 },
//                 deleteTap: (image) {
//                   _screenshots.remove(image);
//                   setState(() {});
//                 },
//               ),
//               gapH20,
//             ],
//           ),
//         ),
//       ),
//       actions: [
//         CreateProjectButton(
//           onTap: () {
//             if (!_formKey.currentState!.validate()) return;
//             ref
//                 .read(adminCreateProjectControllerProvider.notifier)
//                 .createProject(
//                   Project(
//                     mainImageUrl: _mainImage == null ? '' : _mainImage!,
//                     companyNameEn: companyNameEN,
//                     companyNameEs: companyNameES,
//                     shortDescriptionEn: shortDescriptionEN,
//                     shortDescriptionEs: shortDescriptionES,
//                     technologies: _technologies,
//                     screenshotsUrls:
//                         _screenshots.map((e) => e.codeUnitsString).toList(),
//                     featuresEN: _featuresEN,
//                     featuresES: _featuresES,
//                     websiteUrl: websiteUrl,
//                     sourceCodeUrl: sourceUrl,
//                   ),
//                 )
//                 .whenComplete(() {
//               if (!context.mounted) return;
//               Navigator.of(context).pop();
//             });
//           },
//         ),
//       ],
//     );
//   }
// }
